const express = require('express');
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sql } = require('../db');

const router = express.Router();

const registerSchema = z.object({
  phone: z.string().min(6),
  username: z.string().min(2),
  password: z.string().min(8),
});

const loginSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(8),
});

function issueToken(res, userId) {
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: userId, expiresIn: '7d' });
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(process.env.COOKIE_NAME || 'uim_token', token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const exist = await sql`
      SELECT id FROM users WHERE phone = ${data.phone} OR username = ${data.username} LIMIT 1
    `;
    if (exist.length) return res.status(400).json({ error: 'phone or username already exists' });

    const id = crypto.randomUUID();
    const hash = await bcrypt.hash(data.password, 12);
    await sql`
      INSERT INTO users (id, phone, username, password_hash)
      VALUES (${id}, ${data.phone}, ${data.username}, ${hash})
    `;
    await sql`INSERT INTO profiles (user_id) VALUES (${id})`;
    issueToken(res, id);
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e?.message || 'bad request' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const rows = await sql`SELECT id, password_hash FROM users WHERE phone = ${data.phone} LIMIT 1`;
    if (!rows.length) return res.status(400).json({ error: 'user not found' });
    const user = rows[0];
    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'wrong password' });
    issueToken(res, user.id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e?.message || 'bad request' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'uim_token');
  res.json({ ok: true });
});

module.exports = router;
