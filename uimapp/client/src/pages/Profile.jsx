import React from 'react';
import { getOnboarding, clearOnboarding } from '../lib/onboardingStore';
import '../styles.css';

export default function Profile() {
  const data = getOnboarding();

  return (
    <div className="profile-screen">
      <header className="profile-head">
        <div className="ph-left">
          <div className="avatar">
            <img src={data.photo || '/img/ava-placeholder.png'} alt="" />
          </div>
          <div>
            <div className="ph-name">{data.name || 'Без имени'}</div>
            <div className="ph-phone">{data.phone}</div>
          </div>
        </div>

        <button className="ph-edit" onClick={() => alert('Позже тут будет редактирование')}>
          Редактировать
        </button>
      </header>

      <section className="profile-card">
        <h3>Параметры</h3>
        <div className="grid-2">
          <div>
            <b>Возраст:</b> {data.age ?? '—'}
          </div>
          <div>
            <b>Рост:</b> {data.height ?? '—'} см
          </div>
          <div>
            <b>Вес:</b> {data.weight ?? '—'} кг
          </div>
          <div>
            <b>Пол:</b>{' '}
            {data.gender === 'female' ? 'Женский' : data.gender === 'male' ? 'Мужской' : '—'}
          </div>
        </div>
      </section>

      <section className="profile-card">
        <h3>Цели</h3>
        <div className="chips">
          {(data.goals || []).map((g) => (
            <span key={g} className="chip">
              {g}
            </span>
          ))}
        </div>
      </section>

      <section className="profile-card">
        <h3>Активность</h3>
        <div>{data.activity || '—'}</div>
      </section>

      <section className="profile-card">
        <h3>Привычки</h3>
        <div className="chips">
          {(data.habits || []).map((h) => (
            <span key={h} className="chip">
              {h}
            </span>
          ))}
        </div>
      </section>

      <section className="profile-card">
        <h3>Тариф</h3>
        <div>
          {{
            pro: 'UIM.PRO',
            trial: 'Пробный',
            basic: 'Базовый',
          }[data.plan] || '—'}
        </div>
      </section>

      <div className="profile-actions">
        <button
          className="btn-ghost"
          onClick={() => {
            clearOnboarding();
            location.reload();
          }}>
          Сбросить ответы
        </button>
      </div>
    </div>
  );
}
