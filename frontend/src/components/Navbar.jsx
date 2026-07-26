import React from 'react';
import { GraduationCap, Menu, Bell } from 'lucide-react';
import '../styles/navbar.css';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <Menu size={22} />
        </button>
        <div className="navbar-brand">
          <span className="brand-icon">
            <GraduationCap size={22} />
          </span>
          <div className="brand-text">
            <span className="brand-title">Scholarship Tracker</span>
            <span className="brand-subtitle">Application &amp; Disbursement Portal</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="navbar-user">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Scholarship Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
