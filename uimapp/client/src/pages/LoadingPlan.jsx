import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoadingPlan(){
  const nav = useNavigate()
  const [p, setP] = useState(0)

  useEffect(()=>{
    const id = setInterval(()=>setP(x=> Math.min(100, x+7)), 120)
    const timer = setTimeout(()=>nav('/profile'), 2500)
    return ()=>{ clearInterval(id); clearTimeout(timer) }
  },[])

  return (
    <div className="center">
      <div style={{textAlign:'center'}}>
        <h2 style={{fontSize:48, margin:0}}>{p}%</h2>
        <div style={{marginTop:12}}>Составляем ваш план</div>
        <div style={{color:'#888', marginTop:8, fontSize:12}}>Анализируем ответы · Считаем калории · Готовим профиль</div>
      </div>
    </div>
  )
}
