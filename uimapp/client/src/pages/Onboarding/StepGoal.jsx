import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StepGoal() {
  const nav = useNavigate();
  const [goal, setGoal] = useState('lose');

  function next(e) {
    e.preventDefault();
    const payload = { goal };
    sessionStorage.setItem(
      'onb',
      JSON.stringify({ ...JSON.parse(sessionStorage.getItem('onb') || '{}'), ...payload }),
    );
    nav('/onboarding/activity');
  }

  return (
    <div className="center bg-cover bg-onboarding">
      <div className="card glass">
        <div className="stepper">
          <span className="dot active" />
          <span className="dot active" />
          <span className="dot" />
        </div>
        <h2 className="title">Ваша основная цель</h2>
        <form onSubmit={next} className="grid">
          <div className="toggle">
            <button
              type="button"
              className={goal === 'lose' ? 'active' : ''}
              onClick={() => setGoal('lose')}>
              Похудеть
            </button>
            <button
              type="button"
              className={goal === 'maintain' ? 'active' : ''}
              onClick={() => setGoal('maintain')}>
              Поддерживать
            </button>
            <button
              type="button"
              className={goal === 'gain' ? 'active' : ''}
              onClick={() => setGoal('gain')}>
              Набрать
            </button>
          </div>
          <button className="btn">Далее</button>
        </form>
      </div>
    </div>
  );
}
