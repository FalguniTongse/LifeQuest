const { query } = require('../db/connection');

async function listAll(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM achievements ORDER BY condition_value ASC');
    res.json({ success: true, achievements: rows });
  } catch (err) {
    next(err);
  }
}

async function listUnlocked(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT a.*, ua.unlocked_at FROM user_achievements ua
       JOIN achievements a ON a.id = ua.achievement_id
       WHERE ua.user_id = $1
       ORDER BY ua.unlocked_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, unlocked: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, listUnlocked };
