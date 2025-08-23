import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';

export default function StepActivity() {
  const nav = useNavigate();
  const [activityLevel, setActivityLevel] = useState('sedentary');

  async function finish(e) {
    e.preventDefault();
    const data = JSON.parse(sessionStorage.getItem('onb') || '{}');
    try {
      await api('/api/onboarding', {
        method: 'POST',
        body: {
          ...Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, isNaN(v) ? v : Number(v)]),
          ),
          activityLevel,
        },
      });
      nav('/loading');
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="center bg-cover bg-onboarding">
      <div className="card glass">
        <div className="stepper">
          <span className="dot active" />
          <span className="dot active" />
          <span className="dot active" />
        </div>
        <h2 className="title">Уровень активности</h2>
        <form onSubmit={finish} className="grid">
          <div className="toggle">
            <button
              type="button"
              className={activityLevel === 'sedentary' ? 'active' : ''}
              onClick={() => setActivityLevel('sedentary')}>
              Малоподвижный
            </button>
            <button
              type="button"
              className={activityLevel === 'light' ? 'active' : ''}
              onClick={() => setActivityLevel('light')}>
              Умеренный
            </button>
            <button
              type="button"
              className={activityLevel === 'moderate' ? 'active' : ''}
              onClick={() => setActivityLevel('moderate')}>
              Тренируюсь
            </button>
            <button
              type="button"
              className={activityLevel === 'high' ? 'active' : ''}
              onClick={() => setActivityLevel('high')}>
              Высокий
            </button>
          </div>
          <button className="btn">Готово</button>
        </form>
      </div>
    </div>
  );
}
