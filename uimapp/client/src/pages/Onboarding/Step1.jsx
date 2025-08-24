// src/pages/Onboarding/Step1.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressDots from '../../components/ProgressDots';
import { saveOnboarding } from '../../lib/onboardingStore';
import '../../styles.css';

export default function Step1() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'female',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function next(e) {
    e.preventDefault(); // <— ключевая строка
    const { age, height, weight, gender } = form; // берём из state
    saveOnboarding({ age, height, weight, gender });
    nav('/onboarding/goals');
  }

  return (
    <div className="auth-screen" style={{ backgroundImage: "url('/img/bg/bg-test.png')" }}>
      <img src="/img/logo-green.svg" alt="Uim.Tracker" className="onb-logo" />

      <div className="glass-card reg-card onb-card">
        {/* это первый шаг */}
        <ProgressDots total={6} current={1} />

        <div className="onb-card-head">
          <div className="onb-cap">Анкета пользователя</div>
          <button type="button" className="onb-back" onClick={() => nav(-1)}>
            Назад
          </button>
        </div>

        <h1 className="onb-title">Немного о себе</h1>

        <form className="auth-form" onSubmit={next}>
          <label className="input-row onb-input">
            <input
              className="uim-input"
              name="age"
              value={form.age}
              onChange={onChange}
              placeholder="Сколько вам лет?"
              inputMode="numeric"
              required
            />
          </label>

          <label className="input-row onb-input">
            <input
              className="uim-input"
              name="height"
              value={form.height}
              onChange={onChange}
              placeholder="Ваш рост"
              inputMode="numeric"
              required
            />
          </label>

          <label className="input-row onb-input">
            <input
              className="uim-input"
              name="weight"
              value={form.weight}
              onChange={onChange}
              placeholder="Ваш вес"
              inputMode="numeric"
              required
            />
          </label>

          <div className="onb-input onb-gender">
            <span className="onb-gender-label">Ваш пол</span>
            <div className="segmented">
              <button
                type="button"
                className={`seg ${form.gender === 'female' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, gender: 'female' })}>
                Женский
              </button>
              <button
                type="button"
                className={`seg ${form.gender === 'male' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, gender: 'male' })}>
                Мужской
              </button>
            </div>
          </div>

          <button type="submit" className="cta-lime">
            <span className="cta-text">Продолжить</span>
            <img src="/img/btn-step.svg" alt="" height={35} />
          </button>
        </form>
      </div>
    </div>
  );
}
