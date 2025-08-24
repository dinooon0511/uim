// server/scripts/db-init.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing in server/.env');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
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

  console.log('DB schema ensured ✅');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
