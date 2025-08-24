// uimapp/server/src/db.js
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set');
}
const sql = neon(process.env.DATABASE_URL);

/** Создаём схемы при первом холодном старте (без Prisma) */
async function ensureSchema() {
  // users
  await sql(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);

  // profiles
  await sql(`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      age INT,
      height_cm INT,
      weight_kg DOUBLE PRECISION,
      sex TEXT,
      activity_level TEXT,
      goal TEXT,
      habits TEXT,
      calorie_target INT,
      protein_target INT,
      fat_target INT,
      carb_target INT,
      onboarding_complete BOOLEAN DEFAULT FALSE,
      avatar_url TEXT,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}

module.exports = { sql, ensureSchema };
