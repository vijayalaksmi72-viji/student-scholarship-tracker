import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import '../styles/states.css';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-container error-state">
      <div className="state-icon error-icon">
        <AlertTriangle size={32} />
      </div>
      <p className="state-title">Something went wrong</p>
      <p className="state-text">{message || 'We could not complete your request. Please try again.'}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          <RotateCcw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}
