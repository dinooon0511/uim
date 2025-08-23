import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await api('/api/auth/login', { method: 'POST', body: { phone, password } });
      const me = await api('/api/me');
      if (me?.profile?.onboardingComplete) nav('/profile');
      else nav('/onboarding/step1');
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div
      className="login-page bg-cover"
      style={{ backgroundImage: "url('/img/bg/bg-tennis.png')" }}>
      <div className="login-hero-top">MANY TASKS</div>

      <div className="login-card glass">
        <div className="login-card-header">
          <div className="login-brand">
            <img src="/img/logo-white.svg" alt="logo-white" height={21} />
          </div>
          <Link to="/register" className="login-link">
            Регистрация
          </Link>
        </div>

        <h1 className="login-title">Войти</h1>

        <form onSubmit={submit} className="login-form">
          {/* телефон */}
          <div className="input-pill">
            <span className="pill-icon" />
            <input
              className="pill-input"
              inputMode="tel"
              placeholder="+7"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* пароль */}
          <div className="input-pill">
            <span className="pill-icon" />
            <input
              className="pill-input"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="forgot-btn">
              Забыли?
            </button>
          </div>

          {/* НИЖНЯЯ СТРОКА: текст + svg-кнопка */}
          <div className="login-bottom-row">
            <p className="login-note">
              Нажимая «Далее», вы подтверждаете, что ознакомились и принимаете условия
              Пользовательского соглашения и Политики конфиденциальности, а также даёте согласие на
              обработку ваших персональных данных.
            </p>

            {/* svg как кнопка отправки формы */}
            <button type="submit" className="login-go-img" aria-label="Далее">
              <img src="/img/login-btn.svg" alt="Далее" />
            </button>
          </div>

          {/* маленький текст под строкой */}
          <div className="login-more">Нажмите, чтобы узнать подробнее</div>

          {err && <div className="login-error">{err}</div>}
        </form>
      </div>

      <div className="login-hero-bottom">ONE SOLUTION</div>
    </div>
  );
}
