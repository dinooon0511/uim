// uimapp/server/src/app.js
require('dotenv').config();

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

// 4) Health и маршруты
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/onboarding', onboardingRoutes);

// 5) ОБЯЗАТЕЛЬНО экспорт без listen (для Vercel)
module.exports = app;
