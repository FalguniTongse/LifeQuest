const { query } = require('../db/connection');
const { AppError } = require('../middleware/errorHandler');
const { deriveLevelState } = require('../services/xpService');

function serializeCharacter(row) {
  const levelState = deriveLevelState(row.total_xp);
  return {
    level: levelState.level,
    totalXp: row.total_xp,
    xpIntoLevel: levelState.xpIntoLevel,
    xpForNextLevel: levelState.xpForNextLevel,
    progressPercent: levelState.progressPercent,
    gold: row.gold,
    attributes: {
      intellect: row.intellect,
      strength: row.strength,
      wellness: row.wellness,
      creativity: row.creativity,
      social: row.social,
    },
    streak: { current: row.current_streak, longest: row.longest_streak },
  };
}

async function getCharacter(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM characters WHERE user_id = $1', [req.user.id]);
    if (rows.length === 0) throw new AppError('Character not found.', 404);
    res.json({ success: true, character: serializeCharacter(rows[0]) });
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT status, COUNT(*)::int AS count FROM quests WHERE user_id = $1 GROUP BY status`,
      [req.user.id]
    );
    const counts = { PENDING: 0, COMPLETED: 0, CANCELLED: 0, EXPIRED: 0 };
    rows.forEach((r) => { counts[r.status] = r.count; });
    res.json({ success: true, stats: counts });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCharacter, getStats, serializeCharacter };
