const allowlist = [process.env.CLIENT_ORIGIN, 'http://localhost:5173'].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // Разрешаем без Origin (например, curl) и локалку
    if (!origin) return cb(null, true);
    // Быстрый тест: разрешить любые vercel-домены (временно, см. ниже)
    if (process.env.ALLOW_ANY_VERCEL === '1' && /\.vercel\.app$/.test(origin))
      return cb(null, true);
    // Точный allowlist
    if (allowlist.includes(origin)) return cb(null, true);
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
// КРИТИЧЕСКО: отдельный хэндлер для префлайта
app.options('*', cors(corsOptions));
