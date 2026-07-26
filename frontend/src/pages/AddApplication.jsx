import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm.jsx';
import { createApplication } from '../api/api.js';
import '../styles/form.css';

export default function AddApplication() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(formData) {
    setSubmitting(true);
    setServerErrors([]);
    try {
      const res = await createApplication(formData);
      setSuccessMessage(`Application ${res.data.application_id} created successfully!`);
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
        <h1>Add New Application</h1>
        <p className="dashboard-subtitle">Fill in the student and scholarship details below.</p>
      </div>

      {successMessage && <div className="form-success-banner">{successMessage}</div>}

      <div className="form-card">
        <ApplicationForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          submitting={submitting}
          submitLabel="Create Application"
          serverErrors={serverErrors}
        />
      </div>
    </div>
  );
}
