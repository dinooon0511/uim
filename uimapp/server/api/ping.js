module.exports = async (_req, res) => {
  res.status(200).json({
    ok: true,
    node: process.version,
    hasDbUrl: Boolean(process.env.DATABASE_URL),
    clientOrigin: process.env.CLIENT_ORIGIN || null,
  });
};
