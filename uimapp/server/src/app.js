require('dotenv').config();
const { sql, ensureSchema } = require('./db');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const onboardingRoutes = require('./routes/onboarding');

// 1) СОЗДАЁМ app СРАЗУ
const app = express();

// 2) CORS-конфиг
const allowlist = [process.env.CLIENT_ORIGIN, 'http://localhost:5173'].filter(Boolean);
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (process.env.ALLOW_ANY_VERCEL === '1' && /\.vercel\.app$/.test(origin))
      return cb(null, true);
    if (allowlist.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// 3) Мидлвары
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // префлайт
// поднимем таблицы, если их ещё нет (выполнится на холодном старте)
ensureSchema().catch((err) => console.error('ensureSchema failed:', err));

// 4) Health и маршруты
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/onboarding', onboardingRoutes);

app.get('/api/debug/tables', async (_req, res) => {
  try {
    const rows = await sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    res.json(rows.map((r) => r.tablename));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

// 5) ОБЯЗАТЕЛЬНО экспорт без listen (для Vercel)
module.exports = app;
