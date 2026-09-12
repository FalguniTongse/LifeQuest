const jwt = require('jsonwebtoken');

/**
 * Verifies the Bearer JWT on the request, then attaches { id } to req.user.
 * This is the only place a user's identity is established for protected routes -
 * every controller/service downstream must still verify resource ownership.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}

module.exports = { requireAuth };
