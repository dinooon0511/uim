// src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { ensureSchema, sql } = require('./db');
const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const onboardingRoutes = require('./routes/onboarding');

const app = express();

// ———————————————————————————————————————————
// 1) Trust proxy (нужно, чтобы SameSite=None куки уезжали через https на Vercel)
app.set('trust proxy', 1);

// ———————————————————————————————————————————
// 2) CORS
const allowlist = [
  process.env.CLIENT_ORIGIN, // прод: https://<front>.vercel.app
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // curl/скрипты без Origin — пропускаем
    if (!origin) return cb(null, true);

    // временно: разрешить любые *.vercel.app при ALLOW_ANY_VERCEL=1
    if (process.env.ALLOW_ANY_VERCEL === '1' && /\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }

    // строгий allowlist
    if (allowlist.includes(origin)) return cb(null, true);

    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// ———————————————————————————————————————————
// 3) Мидлвары
app.disable('x-powered-by');
app.use(
  helmet({
    // без CSP, чтобы не ломать dev/статические ресурсы фронта
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/plain' }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // префлайт для всех путей

// поднимем схему на холодном старте (Vercel Lambda)
ensureSchema().catch((err) => console.error('ensureSchema failed:', err));

// ———————————————————————————————————————————
// 4) Тех.эндпоинты
app.get('/api/health', (_req, res) =>
  res.json({
    ok: true,
    node: process.version,
    hasDbUrl: !!process.env.DATABASE_URL,
    clientOrigin: process.env.CLIENT_ORIGIN,
  }),
);

// какие таблицы есть в public
app.get('/api/debug/tables', async (_req, res) => {
  try {
    const rows = await sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    res.json(rows.map((r) => r.tablename));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

// какие роуты зарегистрированы в Express
app.get('/api/debug/routes', (_req, res) => {
  const routes = [];
  app._router.stack.forEach((m) => {
    if (m.route && m.route.path) {
      routes.push({ path: m.route.path, methods: m.route.methods });
    } else if (m.name === 'router' && m.handle?.stack) {
      m.handle.stack.forEach((h) => {
        if (h.route && h.route.path) {
          routes.push({ path: h.route.path, methods: h.route.methods });
        }
      });
    }
  });
  res.json(routes);
});

// ———————————————————————————————————————————
// 5) Бизнес-роуты
app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/onboarding', onboardingRoutes);

// ———————————————————————————————————————————
// 6) 404 для API
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'NOT_FOUND' });
});

// 7) Глобальный обработчик ошибок (в т.ч. CORS)
app.use((err, _req, res, _next) => {
  if (err && /CORS/i.test(err.message)) {
    return res.status(403).json({ error: 'CORS_FORBIDDEN', detail: err.message });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'INTERNAL', detail: String(err?.message || err) });
});

// ———————————————————————————————————————————
// 8) Экспорт без listen (важно для Vercel)
// локально ты поднимаешь через server/index.js, на Vercel — импортирует сам
module.exports = app;
