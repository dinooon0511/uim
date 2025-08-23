import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Register from './pages/Register'
import Step1 from './pages/Onboarding/Step1'
import StepGoal from './pages/Onboarding/StepGoal'
import StepActivity from './pages/Onboarding/StepActivity'
import LoadingPlan from './pages/LoadingPlan'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding/step1" element={<Step1 />} />
      <Route path="/onboarding/goal" element={<StepGoal />} />
      <Route path="/onboarding/activity" element={<StepActivity />} />
      <Route path="/loading" element={<LoadingPlan />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}
