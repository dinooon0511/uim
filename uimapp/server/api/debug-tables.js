const { neon } = require('@neondatabase/serverless');

module.exports = async (_req, res) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows =
      await sql`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`;
    res.status(200).json(rows.map((r) => r.tablename));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
