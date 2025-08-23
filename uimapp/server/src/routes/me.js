const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authRequired } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true, phone: true, username: true, createdAt: true,
      profile: true
    }
  });
  res.json(user);
});

const profileSchema = z.object({
  username: z.string().min(2).optional(),
  age: z.number().int().min(5).max(120).optional(),
  heightCm: z.number().int().min(50).max(250).optional(),
  weightKg: z.number().min(20).max(400).optional(),
  sex: z.enum(['male', 'female']).optional(),
  activityLevel: z.enum(['sedentary','light','moderate','high']).optional(),
  goal: z.enum(['lose','maintain','gain']).optional(),
  avatarUrl: z.string().url().optional(),
});

router.patch('/', authRequired, async (req, res) => {
  try {
    const data = profileSchema.parse(req.body);
    const updates = {};
    if (data.username) {
      await prisma.user.update({ where: { id: req.user.id }, data: { username: data.username } });
    }
    for (const k of ['age','heightCm','weightKg','sex','activityLevel','goal','avatarUrl']) {
      if (data[k] !== undefined) updates[k] = data[k];
    }
    if (Object.keys(updates).length) {
      await prisma.profile.update({ where: { userId: req.user.id }, data: updates });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { profile: true }});
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e?.message || 'bad request' });
  }
});

module.exports = router;
