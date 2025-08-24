// src/db.js
import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function query(q, params) {
  const c = await pool.connect();
  try {
    return await c.query(q, params);
  } finally {
    c.release();
  }
}

export async function ensureSchema() {
  // расширяем схему пользователями и профилем
  await query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      phone TEXT UNIQUE NOT NULL,
      name  TEXT,
      pass_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS profiles (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      age    INT,
      height INT,
      weight NUMERIC(6,2),
      gender TEXT CHECK (gender IN ('male','female')),

      goals    JSONB,     -- массив строк
      activity TEXT,
      habits   JSONB,     -- массив строк
      plan     TEXT,      -- 'pro'|'trial'|'basic'

      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}
