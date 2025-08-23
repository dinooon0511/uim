require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const onboardingRoutes = require('./routes/onboarding');
const allowlist = [
  process.env.CLIENT_ORIGIN, // прод фронт (Vercel)
  'http://localhost:5173', // дев фронт
].filter(Boolean);

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, cb) => {
      // allow SSR/health no-origin and allowlist
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
