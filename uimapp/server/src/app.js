require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const onboardingRoutes = require('./routes/onboarding');

const app = express();

// === CORS ===
const allowlist = [process.env.CLIENT_ORIGIN, 'http://localhost:5173'].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowlist.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// ВАЖНО: отдельная обработка префлайта
app.options('*', cors(corsOptions));

// === Маршруты ===
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/onboarding', onboardingRoutes);

module.exports = app;
