const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authRequired } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

const schema = z.object({
  age: z.number().int().min(10).max(100),
  heightCm: z.number().int().min(80).max(250),
  weightKg: z.number().min(25).max(350),
  sex: z.enum(['male','female']),
  activityLevel: z.enum(['sedentary','light','moderate','high']),
  goal: z.enum(['lose','maintain','gain']),
  habits: z.array(z.string()).optional().default([])
});

function computeTargets({ sex, age, heightCm, weightKg, activityLevel, goal }) {
  // Mifflin–St Jeor
  const s = sex === 'male' ? 5 : -161;
  const BMR = Math.round(10*weightKg + 6.25*heightCm - 5*age + s);
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, high: 1.725 };
  let TDEE = Math.round(BMR * (factors[activityLevel] || 1.2));
  if (goal === 'lose') TDEE = Math.round(TDEE * 0.85);
  if (goal === 'gain') TDEE = Math.round(TDEE * 1.10);
  // macros 30/30/40 protein/fat/carb by calories
  const proteinTarget = Math.round((TDEE * 0.30) / 4);
  const fatTarget = Math.round((TDEE * 0.30) / 9);
  const carbTarget = Math.round((TDEE * 0.40) / 4);
  return { calorieTarget: TDEE, proteinTarget, fatTarget, carbTarget };
}

router.post('/', authRequired, async (req, res) => {
  try {
    const data = schema.parse(req.body);
    const macros = computeTargets(data);
    await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        ...data,
        habits: JSON.stringify(data.habits || []),
        ...macros,
        onboardingComplete: true
      }
    });
    const profile = await prisma.profile.findUnique({ where: { userId: req.user.id }});
    res.json({ ok: true, profile });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e?.message || 'bad request' });
  }
});

module.exports = router;
