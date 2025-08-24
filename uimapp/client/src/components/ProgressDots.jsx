import React from 'react';
import './progress-dots.css';

/** total — всего точек; current — ТЕКУЩИЙ шаг (1-based) */
export default function ProgressDots({ total = 6, current = 1 }) {
  const cur = Math.max(1, Math.min(total, Number(current) || 1));
  const activeIdx = cur - 1;

  return (
    <div className="steps-wrap">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <span className={`step-dot ${i === activeIdx ? 'active' : ''}`} />
          {i < total - 1 && <span className="step-dash" />}
        </React.Fragment>
      ))}
    </div>
  );
}
