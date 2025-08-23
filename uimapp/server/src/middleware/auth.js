const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const token = req.cookies?.[process.env.COOKIE_NAME || 'uim_token'];
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

module.exports = { authRequired };
