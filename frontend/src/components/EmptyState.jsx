import React from 'react';
import { Inbox, SearchX, FileQuestion } from 'lucide-react';
import '../styles/states.css';

const ICONS = {
  empty: Inbox,
  search: SearchX,
  notfound: FileQuestion,
};

export default function EmptyState({ variant = 'empty', title, message, action }) {
  const Icon = ICONS[variant] || Inbox;

  return (
    <div className="state-container empty-state">
      <div className="state-icon empty-icon">
        <Icon size={32} />
      </div>
      <p className="state-title">{title || 'No records found'}</p>
      <p className="state-text">{message || 'There is nothing to show here yet.'}</p>
      {action}
    </div>
  );
}
