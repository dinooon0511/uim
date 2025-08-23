import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (password !== password2) {
      setErr('Пароли не совпадают');
      return;
    }
    try {
      await api('/api/auth/register', { method: 'POST', body: { phone, username, password } });
      nav('/onboarding/step1');
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="center bg-cover bg-register">
      <div className="card">
        <div className="top-actions">
          <Link to="/login">Вход</Link>
        </div>
        <h2 className="title">Регистрация</h2>
        <form onSubmit={submit} className="grid">
          <input
            className="input"
            placeholder="Ваше имя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            placeholder="+7"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Повторите пароль"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          {err && <div style={{ color: '#ff6b6b', fontSize: 12 }}>{err}</div>}
          <button className="btn">Далее</button>
        </form>
      </div>
    </div>
  );
}
