// uimapp/server/api/[...all].js
const app = require('../src/app');

function setCors(res, origin, req) {
  if (!origin) return;
  // Разрешаем точный фронт и (временно) любые *.vercel.app для диагностики
  const allowAnyVercel = process.env.ALLOW_ANY_VERCEL === '1' && /\.vercel\.app$/.test(origin);
  const allowlist = [process.env.CLIENT_ORIGIN, 'http://localhost:5173'].filter(Boolean);

  if (allowAnyVercel || allowlist.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] || 'Content-Type,Authorization',
    );
  }
}

module.exports = (req, res) => {
  const origin = req.headers.origin;

  // Всегда ставим CORS заголовки на ответ
  setCors(res, origin, req);

  // Жёстко обрабатываем префлайт ДО Express
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // Дальше — само Express-приложение
  return app(req, res);
};
