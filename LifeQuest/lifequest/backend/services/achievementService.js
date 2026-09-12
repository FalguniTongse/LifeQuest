const { attributeForCategory } = require('./attributeService');

/**
 * Evaluates every achievement definition against the user's current stats and quest
 * history, inserting any newly-satisfied achievement inside the given transaction client.
 * Idempotent: relies on the UNIQUE(user_id, achievement_id) constraint plus an explicit
 * pre-check, so an achievement is never unlocked twice.
 */
async function evaluateAchievements(client, userId, character) {
  const { rows: definitions } = await client.query('SELECT * FROM achievements');
  const { rows: unlockedRows } = await client.query(
    'SELECT achievement_id FROM user_achievements WHERE user_id = $1',
    [userId]
  );
  const unlockedIds = new Set(unlockedRows.map((r) => r.achievement_id));

  const { rows: countRows } = await client.query(
    `SELECT category, COUNT(*)::int AS count
     FROM quests WHERE user_id = $1 AND status = 'COMPLETED'
     GROUP BY category`,
    [userId]
  );
  const categoryCounts = {};
  let totalCompleted = 0;
  for (const row of countRows) {
    categoryCounts[row.category] = row.count;
    totalCompleted += row.count;
  }

  const newlyUnlocked = [];

  for (const def of definitions) {
    if (unlockedIds.has(def.id)) continue;

    let satisfied = false;
    if (def.condition_type === 'STREAK') {
      satisfied = character.current_streak >= def.condition_value;
    } else if (def.condition_type === 'TOTAL_XP') {
      satisfied = character.total_xp >= def.condition_value;
    } else if (def.condition_type === 'QUESTS_COMPLETED') {
      satisfied = totalCompleted >= def.condition_value;
    } else if (def.condition_type.startsWith('CATEGORY_COUNT_')) {
      const category = def.condition_type.replace('CATEGORY_COUNT_', '');
      const readable = category.charAt(0) + category.slice(1).toLowerCase();
      satisfied = (categoryCounts[readable] || 0) >= def.condition_value;
    }

    if (!satisfied) continue;

    const inserted = await client.query(
      `INSERT INTO user_achievements (user_id, achievement_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, achievement_id) DO NOTHING
       RETURNING id`,
      [userId, def.id]
    );

    if (inserted.rows.length > 0) {
      if (def.reward_gold) {
        await client.query('UPDATE characters SET gold = gold + $1 WHERE user_id = $2', [def.reward_gold, userId]);
      }
      if (def.reward_xp) {
        await client.query('UPDATE characters SET total_xp = total_xp + $1 WHERE user_id = $2', [def.reward_xp, userId]);
      }
      newlyUnlocked.push({
        id: def.id,
        name: def.name,
        description: def.description,
        rewardGold: def.reward_gold,
        rewardXp: def.reward_xp,
      });
    }
  }

  return newlyUnlocked;
}

module.exports = { evaluateAchievements, attributeForCategory };
