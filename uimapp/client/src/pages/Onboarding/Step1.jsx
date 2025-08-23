import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Step1() {
  const nav = useNavigate();
  const [age, setAge] = useState('');
  const [heightCm, setHeight] = useState('');
  const [weightKg, setWeight] = useState('');
  const [sex, setSex] = useState('female');

  function next(e) {
    e.preventDefault();
    const payload = { age, heightCm, weightKg, sex };
    sessionStorage.setItem(
      'onb',
      JSON.stringify({ ...JSON.parse(sessionStorage.getItem('onb') || '{}'), ...payload }),
    );
    nav('/onboarding/goal');
  }

  return (
    <div className="center bg-cover bg-onboarding">
      <div className="card glass">
        <div className="stepper">
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <h2 className="title">Немного о себе</h2>
        <form onSubmit={next} className="grid">
          <input
            className="input"
            placeholder="Сколько вам лет?"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            className="input"
            placeholder="Ваш рост (см)"
            value={heightCm}
            onChange={(e) => setHeight(e.target.value)}
          />
          <input
            className="input"
            placeholder="Ваш вес (кг)"
            value={weightKg}
            onChange={(e) => setWeight(e.target.value)}
          />
          <div className="toggle">
            <button
              type="button"
              className={sex === 'female' ? 'active' : ''}
              onClick={() => setSex('female')}>
              Женский
            </button>
            <button
              type="button"
              className={sex === 'male' ? 'active' : ''}
              onClick={() => setSex('male')}>
              Мужской
            </button>
          </div>
          <button className="btn">Продолжить</button>
        </form>
      </div>
    </div>
  );
}
