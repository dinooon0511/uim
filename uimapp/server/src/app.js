// uimapp/server/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const onboardingRoutes = require('./routes/onboarding');

const app = express();

// CORS allowlist для дев и прода
const allowlist = [
  process.env.CLIENT_ORIGIN, // фронт на Vercel
  'http://localhost:5173', // дев-фронт
].filter(Boolean);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowlist.includes(origin)) cb(null, true);
      else cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/onboarding', onboardingRoutes);

// Ничего не listen здесь — экспортируем app!
module.exports = app;
