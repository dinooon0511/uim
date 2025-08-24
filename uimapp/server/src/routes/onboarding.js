// src/routes/onboarding.js
import { Router } from 'express';
import { authRequired } from '../mw/auth.js';
import { query } from '../db.js';

const r = Router();

/**
 * Сохранить/обновить профиль
 * body: { age,height,weight,gender,goals[],activity,habits[],plan,name? }
 */
r.post('/complete', authRequired, async (req, res) => {
  const uid = req.user.id;
  const {
    age,
    height,
    weight,
    gender,
    goals = [],
    activity = null,
    habits = [],
    plan = null,
    name = null,
  } = req.body || {};

  try {
    // Обновим имя пользователя (опционально)
    if (name) {
      await query(`UPDATE users SET name=$2 WHERE id=$1`, [uid, name]);
    }

    // Upsert профиля
    await query(
      `
      INSERT INTO profiles (user_id, age, height, weight, gender, goals, activity, habits, plan, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now())
      ON CONFLICT (user_id) DO UPDATE
         SET age=EXCLUDED.age,
             height=EXCLUDED.height,
             weight=EXCLUDED.weight,
             gender=EXCLUDED.gender,
             goals=EXCLUDED.goals,
             activity=EXCLUDED.activity,
             habits=EXCLUDED.habits,
             plan=EXCLUDED.plan,
             updated_at=now()
    `,
      [
        uid,
        age,
        height,
        weight,
        gender,
        JSON.stringify(goals),
        activity,
        JSON.stringify(habits),
        plan,
      ],
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error' });
  }
});

/** Получить профиль + базовую инфу о пользователе */
r.get('/profile', authRequired, async (req, res) => {
  const uid = req.user.id;
  try {
    const u = await query(`SELECT id, phone, name, created_at FROM users WHERE id=$1`, [uid]);
    const p = await query(`SELECT * FROM profiles WHERE user_id=$1`, [uid]);
    res.json({ user: u.rows[0] || null, profile: p.rows[0] || null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error' });
  }
});

export default r;
