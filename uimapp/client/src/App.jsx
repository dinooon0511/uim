import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Step1 from './pages/Onboarding/Step1';
import Step2 from './pages/Onboarding/Step2';
import Step3 from './pages/Onboarding/Step3';
import Step4 from './pages/Onboarding/Step4';
import Step5 from './pages/Onboarding/Step5';
import LoadingPlan from './pages/Onboarding/LoadingPlan';
import Profile from './pages/Profile';

function NotFound() {
  return (
    <div style={{ padding: 24, color: '#fff', fontFamily: 'sans-serif' }}>
      404 • Страница не найдена
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Step1 />} />
      <Route path="/onboarding/goals" element={<Step2 />} />
      <Route path="/onboarding/activity" element={<Step3 />} />
      <Route path="/onboarding/habits" element={<Step4 />} />
      <Route path="/onboarding/pro" element={<Step5 />} />
      <Route path="/loading-plan" element={<LoadingPlan />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
