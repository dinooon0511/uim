const { ensureSchema } = require('../src/db');

module.exports = async (_req, res) => {
  try {
    await ensureSchema();
    res.status(200).json({ ok: true, action: 'ensureSchema' });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
