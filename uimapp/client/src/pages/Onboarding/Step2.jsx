import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProgressDots from '../../components/ProgressDots';
import { saveOnboarding } from '../../lib/onboardingStore';
import '../../styles.css';

const GOALS = [
  'Похудеть',
  'Набрать мышечную массу',
  'Поддерживать вес и форму',
  'Улучшить самочувствие и энергию',
  'Балансировать сферы жизни (питание, сон, финансы и т. д.)',
];

export default function Step2() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(new Set(['Похудеть'])); // чтобы совпало со скрином

  const toggle = (label) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const next = () => {
    saveOnboarding({ goals: Array.from(selected) });
    nav('/onboarding/activity');
  };

  return (
    <div className="auth-screen" style={{ backgroundImage: "url('/img/bg/bg-test.png')" }}>
      <img src="/img/logo-green.svg" alt="Uim.Tracker" className="onb-logo" />

      <div className="glass-card reg-card onb-card">
        <ProgressDots total={6} current={3} />
        <div className="onb-card-head">
          <div className="onb-cap">Цели</div>
          <button className="onb-back" type="button" onClick={() => nav(-1)}>
            Назад
          </button>
        </div>

        <h1 className="onb-title">Ваша основная цель</h1>

        <div className="goal-list">
          {GOALS.map((label) => {
            const isSel = selected.has(label);
            return (
              <button
                key={label}
                type="button"
                className={`goal-pill ${isSel ? 'selected' : ''}`}
                onClick={() => toggle(label)}
                aria-pressed={isSel}>
                <span className="goal-icon" aria-hidden="true">
                  {/* галочка — показываем только в selected */}
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
        </div>

        <button type="button" className="cta-lime" onClick={next} disabled={selected.size === 0}>
          <span className="cta-text">Далее</span>

          <img src="/img/btn-step.svg" alt="" height={35} />
        </button>
      </div>
    </div>
  );
}
