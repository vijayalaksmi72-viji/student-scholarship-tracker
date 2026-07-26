import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus2, X, IndianRupee, HelpCircle } from 'lucide-react';
import '../styles/sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const linkClass = ({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '');

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={'sidebar' + (isOpen ? ' open' : '')}>
        <div className="sidebar-header">
          <span>Menu</span>
          <button className="icon-btn close-btn" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/add" className={linkClass} onClick={onClose}>
            <FilePlus2 size={18} />
            <span>Add Application</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-card">
            <IndianRupee size={18} />
            <div>
              <p className="sidebar-card-title">Disbursement Cycle</p>
              <p className="sidebar-card-sub">2026 - Cycle II</p>
            </div>
          </div>
          <div className="sidebar-help">
            <HelpCircle size={16} />
            <span>Need help? Contact the scholarship cell.</span>
          </div>
        </div>
      </aside>
    </>
  );
}
