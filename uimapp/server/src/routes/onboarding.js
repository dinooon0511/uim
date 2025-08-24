const express = require('express');
const { z } = require('zod');
const { authRequired } = require('../middleware/auth');
const { sql } = require('../db');

const router = express.Router();

const schema = z.object({
  age: z.number().int().min(10).max(100),
  heightCm: z.number().int().min(80).max(250),
  weightKg: z.number().min(25).max(350),
  sex: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'high']),
  goal: z.enum(['lose', 'maintain', 'gain']),
  habits: z.array(z.string()).optional().default([]),
});

function computeTargets({ sex, age, heightCm, weightKg, activityLevel, goal }) {
  const s = sex === 'male' ? 5 : -161;
  const BMR = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + s);
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, high: 1.725 };
  let TDEE = Math.round(BMR * (factors[activityLevel] || 1.2));
  if (goal === 'lose') TDEE = Math.round(TDEE * 0.85);
  if (goal === 'gain') TDEE = Math.round(TDEE * 1.1);
  const proteinTarget = Math.round((TDEE * 0.3) / 4);
  const fatTarget = Math.round((TDEE * 0.3) / 9);
  const carbTarget = Math.round((TDEE * 0.4) / 4);
  return {
    calorie_target: TDEE,
    protein_target: proteinTarget,
    fat_target: fatTarget,
    carb_target: carbTarget,
  };
}

router.post('/', authRequired, async (req, res) => {
  try {
    const data = schema.parse(req.body);
    const macros = computeTargets(data);
    await sql`
      UPDATE profiles SET
        age = ${data.age},
        height_cm = ${data.heightCm},
        weight_kg = ${data.weightKg},
        sex = ${data.sex},
        activity_level = ${data.activityLevel},
        goal = ${data.goal},
        habits = ${JSON.stringify(data.habits || [])},
        calorie_target = ${macros.calorie_target},
        protein_target = ${macros.protein_target},
        fat_target = ${macros.fat_target},
        carb_target = ${macros.carb_target},
        onboarding_complete = true,
        updated_at = now()
      WHERE user_id = ${req.user.id}
    `;
    const r = (await sql`SELECT * FROM profiles WHERE user_id = ${req.user.id}`)[0];
    res.json({ ok: true, profile: r });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e?.message || 'bad request' });
  }
});

module.exports = router;
