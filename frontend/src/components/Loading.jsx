import React from 'react';
import '../styles/states.css';

export default function Loading({ label }) {
  return (
    <div className="state-container" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="state-text">{label || 'Loading applications...'}</p>
    </div>
  );
}
