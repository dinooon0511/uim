// src/pages/Onboarding/LoadingPlan.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOnboarding, clearOnboarding } from '../../lib/onboardingStore';

export default function LoadingPlan() {
  const nav = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(100, p + Math.floor(10 + Math.random() * 20));
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        // после «расчётов» — редирект на профиль
        nav('/profile', { replace: true });
      }
    }, 350);

    // Отправляем ответы на сервер (не блокируем прогресс)
    (async () => {
      try {
        const base = import.meta.env.VITE_API; // например, https://uim-tau.vercel.app
        if (base) {
          await fetch(`${base}/api/onboarding/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // если JWT лежит в cookie
            // если используешь Bearer в localStorage — добавь:
            // headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(getOnboarding()),
          });
        }
      } catch (e) {
        console.warn('save onboarding failed:', e);
      }
    })();

    return () => clearInterval(timer);
  }, [nav]);

  return (
    <div className="auth-screen" style={{ background: '#1f1f1f', color: '#e8ff60' }}>
      <div style={{ maxWidth: 360, margin: '0 auto', padding: '48px 16px' }}>
        <img src="/img/logo-green.svg" alt="Uim.Tracker" style={{ height: 28 }} />
        <div style={{ marginTop: 56, fontSize: 40, fontWeight: 700 }}>{progress}%</div>
        <div style={{ marginTop: 8, fontSize: 22, color: '#fff' }}>Составляем ваш план</div>

        <div style={{ marginTop: 24, color: '#d6ff5a', fontWeight: 600 }}>Анализируем ответы</div>
        <div style={{ marginTop: 12, color: '#9aa09f' }}>Считаем калории</div>
        <div style={{ marginTop: 8, color: '#9aa09f' }}>Строим прогноз</div>
        <div style={{ marginTop: 8, color: '#9aa09f' }}>Готовим профиль</div>

        <div style={{ marginTop: 24, height: 6, background: '#2b2b2b', borderRadius: 999 }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#e8ff60',
              borderRadius: 999,
              transition: 'width 250ms linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}
