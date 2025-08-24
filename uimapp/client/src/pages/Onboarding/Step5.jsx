import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressDots from '../../components/ProgressDots';
import { saveOnboarding } from '../../lib/onboardingStore';
import '../../styles.css';

const PLANS = [
  { key: 'pro', text: 'Да, хочу персональные рекомендации и аналитику' },
  { key: 'trial', text: 'Пока не уверен(а), хочу попробовать бесплатно' },
  { key: 'basic', text: 'Нет, достаточно базового функционала' },
];

export default function Step5() {
  const nav = useNavigate();
  const [value, setValue] = useState(''); // одиночный выбор

  const submit = () => {
    if (!value) return;
    // сохраняем только выбранный тариф
    saveOnboarding({ plan: value });
    // переходим на экран загрузки
    nav('/loading-plan');
  };

  return (
    <div className="auth-screen" style={{ backgroundImage: "url('/img/bg/bg-test.png')" }}>
      <img src="/img/logo-green.svg" alt="Uim.Tracker" className="onb-logo" />

      <div className="glass-card reg-card onb-card">
        <ProgressDots total={6} current={6} />
        <div className="onb-card-head">
          <div className="onb-cap">UIM.PRO</div>
          <button className="onb-back" type="button" onClick={() => nav(-1)}>
            Назад
          </button>
        </div>

        <h1 className="onb-title">
          Готовы ли вы использовать
          <br />
          расширенные функции
          <br />с поддержкой ИИ?
        </h1>

        <div className="choice-list">
          {PLANS.map((opt) => {
            const selected = value === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                className={`choice-pill ${selected ? 'selected' : ''}`}
                onClick={() => setValue(opt.key)}
                aria-pressed={selected}>
                <div className="choice-title">{opt.text}</div>
              </button>
            );
          })}
        </div>

        <button type="button" className="cta-lime" onClick={submit} disabled={!value}>
          <span className="cta-text">Создать аккаунт</span>
          <img src="/img/btn-step.svg" alt="" height={35} />
        </button>
      </div>
    </div>
  );
}
