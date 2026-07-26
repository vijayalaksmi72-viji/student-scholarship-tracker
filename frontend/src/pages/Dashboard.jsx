import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Clock3, CheckCircle2, Banknote } from 'lucide-react';
import SearchBar from '../components/SearchBar.jsx';
import FilterDropdown from '../components/FilterDropdown.jsx';
import ApplicationTable from '../components/ApplicationTable.jsx';
import Loading from '../components/Loading.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { fetchApplications, deleteApplication } from '../api/api.js';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadApplications = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetchApplications({ search, stage });
      setApplications(res.data || []);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  }, [search, stage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadApplications();
    }, 300); // debounce search input
    return () => clearTimeout(timer);
  }, [loadApplications]);

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.stage === 'Submitted' || a.stage === 'Under Review').length;
    const approved = applications.filter((a) => a.stage === 'Approved').length;
    const disbursedAmount = applications
      .filter((a) => a.stage === 'Disbursed')
      .reduce((sum, a) => sum + (a.amount_sanctioned || 0), 0);
    return { total, pending, approved, disbursedAmount };
  }, [applications]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteApplication(deleteTarget.id);
      setDeleteTarget(null);
      await loadApplications();
    } catch (err) {
      setErrorMessage(err.message);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Scholarship Applications</h1>
          <p className="dashboard-subtitle">Track, review and disburse student scholarships in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          <Plus size={18} />
          Add Application
        </button>
      </div>

      <div className="stat-cards">
        <div className="stat-card gradient-1">
          <div className="stat-icon">
            <Users size={22} />
          </div>
          <div>
            <p className="stat-value">{stats.total}</p>
            <p className="stat-label">Total Applications</p>
          </div>
        </div>
        <div className="stat-card gradient-2">
          <div className="stat-icon">
            <Clock3 size={22} />
          </div>
          <div>
            <p className="stat-value">{stats.pending}</p>
            <p className="stat-label">Pending Review</p>
          </div>
        </div>
        <div className="stat-card gradient-3">
          <div className="stat-icon">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="stat-value">{stats.approved}</p>
            <p className="stat-label">Approved</p>
          </div>
        </div>
        <div className="stat-card gradient-4">
          <div className="stat-icon">
            <Banknote size={22} />
          </div>
          <div>
            <p className="stat-value">₹{stats.disbursedAmount.toLocaleString('en-IN')}</p>
            <p className="stat-label">Total Disbursed</p>
          </div>
        </div>
      </div>

      <div className="dashboard-toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterDropdown value={stage} onChange={setStage} />
      </div>

      <div className="dashboard-content">
        {status === 'loading' && <Loading />}

        {status === 'error' && <ErrorState message={errorMessage} onRetry={loadApplications} />}

        {status === 'success' && applications.length === 0 && search === '' && stage === 'All' && (
          <EmptyState
            variant="empty"
            title="No applications yet"
            message="Get started by adding the first scholarship application."
            action={
              <button className="btn btn-primary" onClick={() => navigate('/add')}>
                <Plus size={16} />
                Add Application
              </button>
            }
          />
        )}

        {status === 'success' && applications.length === 0 && (search !== '' || stage !== 'All') && (
          <EmptyState
            variant="search"
            title="No matching records found"
            message={`We couldn't find any applications matching your search${
              search ? ` "${search}"` : ''
            }${stage !== 'All' ? ` in stage "${stage}"` : ''}.`}
          />
        )}

        {status === 'success' && applications.length > 0 && (
          <ApplicationTable applications={applications} onDelete={setDeleteTarget} />
        )}
      </div>

      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Application?</h3>
            <p>
              Are you sure you want to delete the application for{' '}
              <strong>{deleteTarget.student_name}</strong> ({deleteTarget.application_id})? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
