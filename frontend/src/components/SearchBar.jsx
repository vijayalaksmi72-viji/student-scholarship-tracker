import React from 'react';
import { Search, X } from 'lucide-react';
import '../styles/searchbar.css';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        placeholder={placeholder || 'Search by student name or application ID...'}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search applications"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
