import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Clock } from 'lucide-react';
import '../styles/table.css';

const STAGE_CLASS = {
  Submitted: 'badge-submitted',
  'Under Review': 'badge-review',
  Approved: 'badge-approved',
  Disbursed: 'badge-disbursed',
  Rejected: 'badge-rejected',
};

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '—';
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ApplicationTable({ applications, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Student Name</th>
            <th>Scholarship</th>
            <th>Category</th>
            <th>Requested</th>
            <th>Sanctioned</th>
            <th>Stage</th>
            <th>Applied On</th>
            <th>
              <span className="th-with-icon">
                <Clock size={14} /> Days Waiting
              </span>
            </th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td className="cell-mono">{app.application_id}</td>
              <td className="cell-name">{app.student_name || <span className="cell-missing">—</span>}</td>
              <td>{app.scholarship_name || <span className="cell-missing">Not specified</span>}</td>
              <td>{app.category || <span className="cell-missing">—</span>}</td>
              <td>{formatCurrency(app.amount_requested)}</td>
              <td>{formatCurrency(app.amount_sanctioned)}</td>
              <td>
                <span className={`badge ${STAGE_CLASS[app.stage] || ''}`}>{app.stage}</span>
              </td>
              <td>{formatDate(app.applied_date)}</td>
              <td>
                <span className={app.days_waiting > 30 ? 'days-waiting warning' : 'days-waiting'}>
                  {app.days_waiting ?? '—'} {app.days_waiting !== null ? 'days' : ''}
                </span>
              </td>
              <td className="th-actions">
                <div className="row-actions">
                  <button
                    className="icon-btn action-edit"
                    onClick={() => navigate(`/edit/${app.id}`)}
                    aria-label={`Edit ${app.student_name}`}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="icon-btn action-delete"
                    onClick={() => onDelete(app)}
                    aria-label={`Delete ${app.student_name}`}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
