import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressDots from '../components/ProgressDots';
import '../styles.css';

export default function Register() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    pass: '',
    pass2: '',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    // здесь своя реальная регистрация; пока просто идём к анкете
    setBusy(true);
    try {
      nav('/onboarding'); // поменяй на свой путь, если другой
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen" style={{ backgroundImage: "url('/img/bg/bg-tennis.png')" }}>
      <div className="glass-card reg-card">
        {/* индикатор ДОЛЖЕН быть внутри карточки */}
        <ProgressDots total={6} current={1} />

        <div className="card-head">
          <div className="brand">
            <img className="brand-mark" src="/img/logo-white.svg" alt="Uim.Studio" />
          </div>
          <Link to="/login" className="link-ghost">
            Войти
          </Link>
        </div>

        <h1 className="card-title">Регистрация</h1>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <label className="input-row">
            <span className="input-icon" />
            <input
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="Ваше имя и фамилия"
              className="uim-input"
              required
            />
          </label>

          <label className="input-row">
            <span className="input-icon" />
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="+7"
              inputMode="tel"
              pattern="^\+?[0-9\s\-\(\)]{7,}$"
              className="uim-input"
              required
            />
          </label>

          <label className="input-row">
            <span className="input-icon" />
            <input
              type="password"
              name="pass"
              value={form.pass}
              onChange={onChange}
              placeholder="Пароль"
              className="uim-input"
              required
              minLength={6}
            />
          </label>

          <label className="input-row">
            <span className="input-icon" />
            <input
              type="password"
              name="pass2"
              value={form.pass2}
              onChange={onChange}
              placeholder="Повторите пароль"
              className="uim-input"
              required
            />
          </label>

          {/* текст + кнопка в ОДНОЙ строке */}
          <div className="policy-row">
            <p className="policy">
              Нажимая «Далее», вы подтверждаете, что ознакомились и принимаете условия
              Пользовательского соглашения и Политики конфиденциальности, а также даёте согласие на
              обработку ваших персональных данных.
            </p>
            <button type="submit" className="policy-btn" disabled={busy} aria-label="Далее">
              <img src="/img/login-btn.svg" alt="" />
            </button>
          </div>
        </form>

        <p className="hint">Нажмите, чтобы узнать подробнее</p>
      </div>
    </div>
  );
}
