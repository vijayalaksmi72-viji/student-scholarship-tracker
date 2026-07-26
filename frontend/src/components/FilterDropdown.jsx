import React from 'react';
import { ListFilter } from 'lucide-react';
import '../styles/filterdropdown.css';

const STAGES = ['All', 'Submitted', 'Under Review', 'Approved', 'Disbursed', 'Rejected'];

export default function FilterDropdown({ value, onChange }) {
  return (
    <div className="filter-dropdown">
      <ListFilter size={18} className="filter-icon" />
      <select
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by stage"
      >
        {STAGES.map((stage) => (
          <option key={stage} value={stage}>
            {stage === 'All' ? 'All Stages' : stage}
          </option>
        ))}
      </select>
    </div>
  );
}
