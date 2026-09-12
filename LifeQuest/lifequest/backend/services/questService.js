const { withTransaction } = require('../db/connection');
const { AppError } = require('../middleware/errorHandler');
const { deriveLevelState, baseRewardForDifficulty } = require('./xpService');
const { applyActivity } = require('./streakService');
const { attributeForCategory, attributePointsForDifficulty } = require('./attributeService');
const { evaluateAchievements } = require('./achievementService');

const ALLOWED_CATEGORIES = ['Coding', 'Study', 'Reading', 'Fitness', 'Meditation', 'Art', 'Social'];
const ALLOWED_DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic'];

async function createQuest(userId, input) {
  const { title, description, category, difficulty, durationMinutes, dueDate } = input;
  const base = baseRewardForDifficulty(difficulty);

  const { rows } = await require('../db/connection').query(
    `INSERT INTO quests (user_id, title, description, category, difficulty, duration_minutes, due_date, reward_xp, reward_gold)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [userId, title.trim(), description || null, category, difficulty, durationMinutes || null, dueDate || null, base.xp, base.gold]
  );
  return rows[0];
}

async function listQuests(userId, statusFilter) {
  const params = [userId];
  let sql = 'SELECT * FROM quests WHERE user_id = $1';
  if (statusFilter) {
    params.push(statusFilter);
    sql += ' AND status = $2';
  }
  sql += ' ORDER BY (status = \'PENDING\') DESC, due_date NULLS LAST, created_at DESC';
  const { rows } = await require('../db/connection').query(sql, params);
  return rows;
}

async function getQuestOwned(userId, questId) {
  const { rows } = await require('../db/connection').query(
    'SELECT * FROM quests WHERE id = $1 AND user_id = $2',
    [questId, userId]
  );
  if (rows.length === 0) throw new AppError('Quest not found.', 404);
  return rows[0];
}

async function updateQuest(userId, questId, input) {
  await getQuestOwned(userId, questId); // ownership check
  const { title, description, category, difficulty, durationMinutes, dueDate } = input;
  const base = baseRewardForDifficulty(difficulty);

  const { rows } = await require('../db/connection').query(
    `UPDATE quests SET title = $1, description = $2, category = $3, difficulty = $4,
       duration_minutes = $5, due_date = $6, reward_xp = $7, reward_gold = $8, updated_at = NOW()
     WHERE id = $9 AND user_id = $10 AND status = 'PENDING'
     RETURNING *`,
    [title.trim(), description || null, category, difficulty, durationMinutes || null, dueDate || null, base.xp, base.gold, questId, userId]
  );

  if (rows.length === 0) {
    throw new AppError('Only a pending quest you own can be edited.', 400);
  }
  return rows[0];
}

async function deleteQuest(userId, questId) {
  await getQuestOwned(userId, questId); // ownership check
  await require('../db/connection').query('DELETE FROM quests WHERE id = $1 AND user_id = $2', [questId, userId]);
}

/**
 * The authoritative quest-completion transaction. This is the single place where
 * XP, Gold, attributes, streaks and achievements are ever mutated as a result of
 * completing a quest. Client-supplied reward values are never trusted.
 */
async function completeQuest(userId, questId) {
  return withTransaction(async (client) => {
    const { rows: questRows } = await client.query(
      'SELECT * FROM quests WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [questId, userId]
    );
    if (questRows.length === 0) {
      throw new AppError('Quest not found.', 404);
    }
    const quest = questRows[0];

    if (quest.status !== 'PENDING') {
      throw new AppError('This quest has already been completed or is no longer active.', 400);
    }

    const { rows: charRows } = await client.query(
      'SELECT * FROM characters WHERE user_id = $1 FOR UPDATE',
      [userId]
    );
    const character = charRows[0];

    const rewardXp = quest.reward_xp;
    const rewardGold = quest.reward_gold;
    const attribute = attributeForCategory(quest.category);
    const attributePoints = attributePointsForDifficulty(quest.difficulty);

    const beforeLevel = deriveLevelState(character.total_xp).level;
    const newTotalXp = character.total_xp + rewardXp;
    const afterLevelState = deriveLevelState(newTotalXp);
    const levelUp = afterLevelState.level > beforeLevel;

    const streakResult = applyActivity(
      {
        lastActivityDate: character.last_activity_date,
        currentStreak: character.current_streak,
        longestStreak: character.longest_streak,
      },
      new Date()
    );

    await client.query(
      `UPDATE characters SET
         total_xp = $1,
         level = $2,
         gold = gold + $3,
         ${attribute} = ${attribute} + $4,
         current_streak = $5,
         longest_streak = $6,
         last_activity_date = $7,
         updated_at = NOW()
       WHERE user_id = $8`,
      [
        newTotalXp,
        afterLevelState.level,
        rewardGold,
        attributePoints,
        streakResult.currentStreak,
        streakResult.longestStreak,
        streakResult.lastActivityDate,
        userId,
      ]
    );

    await client.query(
      `UPDATE quests SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [questId]
    );

    await client.query(
      `INSERT INTO xp_history (user_id, quest_id, xp_amount, reason) VALUES ($1, $2, $3, $4)`,
      [userId, questId, rewardXp, `Completed quest: ${quest.title}`]
    );

    const { rows: updatedCharRows } = await client.query(
      'SELECT * FROM characters WHERE user_id = $1',
      [userId]
    );
    const updatedCharacter = updatedCharRows[0];

    const achievementsUnlocked = await evaluateAchievements(client, userId, updatedCharacter);

    return {
      quest: { id: quest.id, title: quest.title, status: 'COMPLETED' },
      rewards: { xp: rewardXp, gold: rewardGold, attribute: { name: attribute, amount: attributePoints } },
      character: {
        level: updatedCharacter.level,
        totalXp: updatedCharacter.total_xp,
        gold: updatedCharacter.gold,
        xpIntoLevel: afterLevelState.xpIntoLevel,
        xpForNextLevel: afterLevelState.xpForNextLevel,
        progressPercent: afterLevelState.progressPercent,
      },
      streak: { current: updatedCharacter.current_streak, longest: updatedCharacter.longest_streak },
      levelUp,
      achievementsUnlocked,
    };
  });
}

module.exports = {
  createQuest,
  listQuests,
  getQuestOwned,
  updateQuest,
  deleteQuest,
  completeQuest,
  ALLOWED_CATEGORIES,
  ALLOWED_DIFFICULTIES,
};
