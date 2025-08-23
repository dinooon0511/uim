const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  phone: z.string().min(10),
  username: z.string().min(2),
  password: z.string().min(8),
});

const loginSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(8),
});

function issueToken(res, userId) {
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: userId, expiresIn: '7d' });
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(process.env.COOKIE_NAME || 'uim_token', token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax', // для кросс-доменных запросов нужен none
    secure: isProd, // на https — обязательно true
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const passwordHash = await argon2.hash(data.password);
    const user = await prisma.user.create({
      data: {
        phone: data.phone,
        username: data.username,
        passwordHash,
        profile: { create: {} },
      },
    });
    issueToken(res, user.id);
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e?.message || 'bad request' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (!user) return res.status(400).json({ error: 'user not found' });
    const ok = await argon2.verify(user.passwordHash, data.password);
    if (!ok) return res.status(400).json({ error: 'wrong password' });
    issueToken(res, user.id);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e?.message || 'bad request' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'uim_token');
  res.json({ ok: true });
});

module.exports = router;
