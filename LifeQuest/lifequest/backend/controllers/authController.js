const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, withTransaction } = require('../db/connection');
const { AppError } = require('../middleware/errorHandler');

function issueToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(row) {
  return { id: row.id, username: row.username, email: row.email, createdAt: row.created_at };
}

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const { rows: existing } = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username]
    );
    if (existing.length > 0) {
      throw new AppError('An account with that email or username already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await withTransaction(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
        [username.trim(), email.toLowerCase().trim(), passwordHash]
      );
      const newUser = rows[0];
      await client.query(`INSERT INTO characters (user_id) VALUES ($1)`, [newUser.id]);
      return newUser;
    });

    const token = issueToken(user.id);
    res.status(201).json({ success: true, token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);

    // Generic message regardless of which check fails, to avoid leaking account existence.
    const genericError = new AppError('Invalid email or password.', 401);
    if (rows.length === 0) throw genericError;

    const user = rows[0];
    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) throw genericError;

    const token = issueToken(user.id);
    res.json({ success: true, token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  // Stateless JWT: the client discards the token. Included for API completeness /
  // future refresh-token revocation.
  res.json({ success: true });
}

async function me(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) throw new AppError('User not found.', 404);
    res.json({ success: true, user: publicUser(rows[0]) });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, me };
