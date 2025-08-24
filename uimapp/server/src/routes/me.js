const express = require('express');
const { z } = require('zod');
const { authRequired } = require('../middleware/auth');
const { sql } = require('../db');

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const rows = await sql`
    SELECT
      u.id, u.phone, u.username, u.created_at,
      p.age, p.height_cm, p.weight_kg, p.sex, p.activity_level, p.goal,
      p.calorie_target, p.protein_target, p.fat_target, p.carb_target,
      p.onboarding_complete, p.avatar_url, p.updated_at
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    WHERE u.id = ${req.user.id}
    LIMIT 1
  `;
  const r = rows[0];
  if (!r) return res.status(404).json({ error: 'not found' });
  res.json({
    id: r.id,
    phone: r.phone,
    username: r.username,
    createdAt: r.created_at,
    profile: {
      age: r.age,
      heightCm: r.height_cm,
      weightKg: r.weight_kg,
      sex: r.sex,
      activityLevel: r.activity_level,
      goal: r.goal,
      calorieTarget: r.calorie_target,
      proteinTarget: r.protein_target,
      fatTarget: r.fat_target,
      carbTarget: r.carb_target,
      onboardingComplete: r.onboarding_complete,
      avatarUrl: r.avatar_url,
      updatedAt: r.updated_at,
    },
  });
});

const profileSchema = z.object({
  username: z.string().min(2).optional(),
  age: z.number().int().min(5).max(120).optional(),
  heightCm: z.number().int().min(50).max(250).optional(),
  weightKg: z.number().min(20).max(400).optional(),
  sex: z.enum(['male', 'female']).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'high']).optional(),
  goal: z.enum(['lose', 'maintain', 'gain']).optional(),
  avatarUrl: z.string().url().optional(),
});

router.patch('/', authRequired, async (req, res) => {
  try {
    const data = profileSchema.parse(req.body);
    if (data.username) {
      await sql`UPDATE users SET username = ${data.username} WHERE id = ${req.user.id}`;
    }
    const fields = [];
    if (data.age !== undefined) fields.push(sql`age = ${data.age}`);
    if (data.heightCm !== undefined) fields.push(sql`height_cm = ${data.heightCm}`);
    if (data.weightKg !== undefined) fields.push(sql`weight_kg = ${data.weightKg}`);
    if (data.sex !== undefined) fields.push(sql`sex = ${data.sex}`);
    if (data.activityLevel !== undefined) fields.push(sql`activity_level = ${data.activityLevel}`);
    if (data.goal !== undefined) fields.push(sql`goal = ${data.goal}`);
    if (data.avatarUrl !== undefined) fields.push(sql`avatar_url = ${data.avatarUrl}`);
    if (fields.length) {
      const set = fields.reduce((a, b, i) => (i ? sql`${a}, ${b}` : b));
      await sql`UPDATE profiles SET ${set}, updated_at = now() WHERE user_id = ${req.user.id}`;
    }
    // вернуть актуальные данные
    const rows = await sql`
      SELECT u.id, u.phone, u.username, u.created_at,
             p.*
        FROM users u LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = ${req.user.id} LIMIT 1
    `;
    const r = rows[0];
    res.json({
      id: r.id,
      phone: r.phone,
      username: r.username,
      createdAt: r.created_at,
      profile: {
        age: r.age,
        heightCm: r.height_cm,
        weightKg: r.weight_kg,
        sex: r.sex,
        activityLevel: r.activity_level,
        goal: r.goal,
        calorieTarget: r.calorie_target,
        proteinTarget: r.protein_target,
        fatTarget: r.fat_target,
        carbTarget: r.carb_target,
        onboardingComplete: r.onboarding_complete,
        avatarUrl: r.avatar_url,
        updatedAt: r.updated_at,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e?.message || 'bad request' });
  }
});

module.exports = router;
