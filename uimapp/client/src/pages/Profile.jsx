import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'

export default function Profile(){
  const [me, setMe] = useState(null)
  const [err, setErr] = useState('')
  useEffect(()=>{
    api('/api/me').then(setMe).catch(e=>setErr(e.message))
  },[])

  if (err) return <div className="center">{err}</div>
  if (!me) return <div className="center">Загрузка…</div>

  const p = me.profile || {}
  return (
    <div className="center">
      <div className="card profile-card">
        <div style={{display:'flex', gap:16, alignItems:'center'}}>
          <img src={p.avatarUrl || 'https://dummyimage.com/72x72/333/fff.png&text=U'} alt="avatar" style={{width:72,height:72,borderRadius:'50%'}}/>
          <div>
            <div style={{fontWeight:700, fontSize:18}}>{me.username}</div>
            <div style={{fontSize:12, color:'#aaa'}}>+{me.phone}</div>
          </div>
        </div>

        <div style={{marginTop:16}} className="grid">
          <div>Возраст: {p.age ?? '—'}</div>
          <div>Рост: {p.heightCm ?? '—'} см</div>
          <div>Вес: {p.weightKg ?? '—'} кг</div>
          <div>Пол: {p.sex === 'female' ? 'Ж' : 'М'}</div>
          <div>Цель: {p.goal}</div>
          <div>Активность: {p.activityLevel}</div>
          <div>Ккал/день: {p.calorieTarget ?? '—'}</div>
          <div>Б: {p.proteinTarget ?? '—'}г · Ж: {p.fatTarget ?? '—'}г · У: {p.carbTarget ?? '—'}г</div>
        </div>

        <div className="tabbar">
          <div className="bar">
            <Link to="/profile">👤</Link>
            <a title="Трекер">📅</a>
            <a title="Финансы">💲</a>
            <a title="Калории">🍽️</a>
            <a title="Баллы">⭐</a>
          </div>
        </div>
      </div>
    </div>
  )
}
