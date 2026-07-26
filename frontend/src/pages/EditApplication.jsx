import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm.jsx';
import Loading from '../components/Loading.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { fetchApplicationById, updateApplication } from '../api/api.js';
import '../styles/form.css';

export default function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading | success | error | notfound
  const [application, setApplication] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadApplication() {
    setStatus('loading');
    try {
      const res = await fetchApplicationById(id);
      setApplication(res.data);
      setStatus('success');
    } catch (err) {
      if (err.status === 404) {
        setStatus('notfound');
      } else {
        setErrorMessage(err.message);
        setStatus('error');
      }
    }
  }

  async function handleSubmit(formData) {
    setSubmitting(true);
    setServerErrors([]);
    try {
      await updateApplication(id, formData);
      setSuccessMessage('Application updated successfully!');
      setTimeout(() => navigate('/'), 900);
    } catch (err) {
      setServerErrors(err.errors && err.errors.length ? err.errors : [err.message]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <h1>Edit Application</h1>
        <p className="dashboard-subtitle">Update the scholarship application details.</p>
      </div>

      {status === 'loading' && <Loading label="Loading application details..." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={loadApplication} />}

      {status === 'notfound' && (
        <EmptyState
          variant="notfound"
          title="Application not found"
          message={`No application exists with ID "${id}". It may have been deleted.`}
          action={
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Back to Dashboard
            </button>
          }
        />
      )}

      {status === 'success' && (
        <>
          {successMessage && <div className="form-success-banner">{successMessage}</div>}
          <div className="form-card">
            <ApplicationForm
              initialData={application}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/')}
              submitting={submitting}
              submitLabel="Update Application"
              serverErrors={serverErrors}
            />
          </div>
        </>
      )}
    </div>
  );
}
