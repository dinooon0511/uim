// uimapp/server/api/index.js
const app = require('../src/app');

// Express-приложение само является (req,res)-handler'ом.
// Явно оборачиваем — так надёжнее для Vercel:
module.exports = (req, res) => app(req, res);
