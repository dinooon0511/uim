import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const nav = useNavigate();
  return (
    <div className="splash">
      <div className="brand">
        <img src="/img/logo.svg" alt="Uim.Tracker" />
        <div className="brand-title">Uim. Tracker</div>
      </div>

      <div className="actions">
        <button className="btn-ghost-lime" onClick={() => nav('/login')}>
          Войти
        </button>
        <button className="btn-lime" onClick={() => nav('/register')}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
