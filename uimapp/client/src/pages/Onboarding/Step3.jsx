import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressDots from '../../components/ProgressDots';
import { saveOnboarding } from '../../lib/onboardingStore';
import '../../styles.css';

const OPTIONS = [
  { title: 'Малоподвижный образ жизни', hint: '' },
  { title: 'Умеренная активность', hint: '[ходьба, редкие тренировки]' },
  { title: 'Регулярные тренировки', hint: '[2–3 раза в неделю]' },
  { title: 'Высокая активность', hint: '[спорт 4+ раз в неделю]' },
  { title: 'Балансировать сферы жизни', hint: '[питание, сон, финансы и т. д.]' },
];

export default function Step3() {
  const nav = useNavigate();
  const [value, setValue] = useState(''); // один выбранный вариант

  const next = () => {
    saveOnboarding({ activity: value });
    nav('/onboarding/habits');
  };

  return (
    <div className="auth-screen" style={{ backgroundImage: "url('/img/bg/bg-test.png')" }}>
      <img src="/img/logo-green.svg" alt="Uim.Tracker" className="onb-logo" />

      <div className="glass-card reg-card onb-card">
        <ProgressDots total={6} current={4} />
        <div className="onb-card-head">
          <div className="onb-cap">Активность</div>
          <button className="onb-back" type="button" onClick={() => nav(-1)}>
            Назад
          </button>
        </div>

        <h1 className="onb-title">Уровень активности</h1>

        <div className="choice-list">
          {OPTIONS.map((opt) => {
            const selected = value === opt.title;
            return (
              <button
                type="button"
                key={opt.title}
                className={`choice-pill ${selected ? 'selected' : ''}`}
                onClick={() => setValue(opt.title)}
                aria-pressed={selected}>
                <div className="choice-text">
                  <div className="choice-title">{opt.title}</div>
                  {opt.hint && <div className="choice-hint">{opt.hint}</div>}
                </div>
              </button>
            );
          })}
        </div>

        <button type="button" className="cta-lime" onClick={next} disabled={!value}>
          <span className="cta-text">Далее</span>
          {/* используй ту же иконку, что на предыдущем шаге */}
          <img src="/img/btn-step.svg" alt="" height={35} />
        </button>
      </div>
    </div>
  );
}
