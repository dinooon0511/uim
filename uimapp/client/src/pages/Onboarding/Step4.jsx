import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressDots from '../../components/ProgressDots';
import { saveOnboarding } from '../../lib/onboardingStore';
import '../../styles.css';

const HABITS = [
  'Вода',
  'Сон',
  'Приём витаминов/лекарств',
  'Физическая активность',
  'Финансовые расходы/накопления',
];

export default function Step4() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(new Set(['Вода'])); // чтобы совпало со скрином
  const [custom, setCustom] = useState('');

  const toggle = (label) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  const next = () => {
    const list = [...selected];
    if (custom.trim()) list.push(custom.trim());
    saveOnboarding({ habits: list });
    nav('/onboarding/pro');
  };

  const hasAny = selected.size > 0 || custom.trim().length > 0;
  const customSelected = custom.trim().length > 0;

  return (
    <div className="auth-screen" style={{ backgroundImage: "url('/img/bg/bg-test.png')" }}>
      <img src="/img/logo-green.svg" alt="Uim.Tracker" className="onb-logo" />

      {/* стеклянная карточка */}
      <div className="glass-card reg-card onb-card">
        <ProgressDots total={6} current={5} />
        <div className="onb-card-head">
          <div className="onb-cap">Привычки</div>
          <button className="onb-back" type="button" onClick={() => nav(-1)}>
            Назад
          </button>
        </div>

        <h1 className="onb-title">Отслеживание привычек</h1>

        {/* варианты */}
        <div className="goal-list">
          {HABITS.map((label) => {
            const isSel = selected.has(label);
            return (
              <button
                key={label}
                type="button"
                className={`goal-pill ${isSel ? 'selected' : ''}`}
                onClick={() => toggle(label)}
                aria-pressed={isSel}>
                <span className="goal-icon" aria-hidden="true">
                  {isSel && (
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                      <path
                        d="M1 6l4 4L15 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="goal-text">{label}</span>
              </button>
            );
          })}

          {/* свой вариант */}
          <div className={`custom-pill ${customSelected ? 'selected' : ''}`}>
            <span className="goal-icon" aria-hidden="true">
              {customSelected && (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path
                    d="M1 6l4 4L15 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <input
              className="custom-input"
              type="text"
              placeholder="Свой вариант (впишите)"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
          </div>
        </div>

        <button type="button" className="cta-lime" onClick={next} disabled={!hasAny}>
          <span className="cta-text">Далее</span>

          <img src="/img/btn-step.svg" alt="" height={35} />
        </button>
      </div>
    </div>
  );
}
