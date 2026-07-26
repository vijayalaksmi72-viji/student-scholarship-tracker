import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import '../styles/form.css';

const STAGES = ['Submitted', 'Under Review', 'Approved', 'Disbursed', 'Rejected'];
const CATEGORIES = ['Merit', 'Need-based', 'Sports', 'Minority'];

const EMPTY_FORM = {
  student_name: '',
  email: '',
  phone: '',
  scholarship_name: '',
  category: '',
  amount_requested: '',
  amount_sanctioned: '',
  stage: 'Submitted',
  applied_date: '',
  remarks: '',
};

export default function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  submitting,
  submitLabel,
  serverErrors,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        student_name: initialData.student_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        scholarship_name: initialData.scholarship_name || '',
        category: initialData.category || '',
        amount_requested: initialData.amount_requested ?? '',
        amount_sanctioned: initialData.amount_sanctioned ?? '',
        stage: initialData.stage || 'Submitted',
        applied_date: initialData.applied_date || '',
        remarks: initialData.remarks || '',
      });
    }
  }, [initialData]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function validate() {
    const errs = {};
    if (!form.student_name.trim() || form.student_name.trim().length < 2) {
      errs.student_name = 'Student name is required (min 2 characters).';
    }
    if (!form.scholarship_name.trim()) {
      errs.scholarship_name = 'Scholarship name is required.';
    }
    if (!form.applied_date) {
      errs.applied_date = 'Applied date is required.';
    } else if (new Date(form.applied_date) > new Date()) {
      errs.applied_date = 'Applied date cannot be in the future.';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Enter a valid email address.';
    }
    if (form.amount_requested !== '' && (isNaN(Number(form.amount_requested)) || Number(form.amount_requested) < 0)) {
      errs.amount_requested = 'Enter a valid non-negative amount.';
    }
    if (form.amount_sanctioned !== '' && (isNaN(Number(form.amount_sanctioned)) || Number(form.amount_sanctioned) < 0)) {
      errs.amount_sanctioned = 'Enter a valid non-negative amount.';
    }
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="student_name">
            Student Name <span className="required">*</span>
          </label>
          <input
            id="student_name"
            type="text"
            value={form.student_name}
            onChange={(e) => handleChange('student_name', e.target.value)}
            placeholder="e.g. Aarav Sharma"
          />
          {clientErrors.student_name && <span className="field-error">{clientErrors.student_name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="student@example.com"
          />
          {clientErrors.email && <span className="field-error">{clientErrors.email}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="10-digit mobile number"
          />
        </div>

        <div className="form-field">
          <label htmlFor="scholarship_name">
            Scholarship Name <span className="required">*</span>
          </label>
          <input
            id="scholarship_name"
            type="text"
            value={form.scholarship_name}
            onChange={(e) => handleChange('scholarship_name', e.target.value)}
            placeholder="e.g. National Merit Scholarship"
          />
          {clientErrors.scholarship_name && <span className="field-error">{clientErrors.scholarship_name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="stage">Stage</label>
          <select id="stage" value={form.stage} onChange={(e) => handleChange('stage', e.target.value)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="amount_requested">Amount Requested (₹)</label>
          <input
            id="amount_requested"
            type="number"
            min="0"
            value={form.amount_requested}
            onChange={(e) => handleChange('amount_requested', e.target.value)}
            placeholder="0"
          />
          {clientErrors.amount_requested && <span className="field-error">{clientErrors.amount_requested}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="amount_sanctioned">Amount Sanctioned (₹)</label>
          <input
            id="amount_sanctioned"
            type="number"
            min="0"
            value={form.amount_sanctioned}
            onChange={(e) => handleChange('amount_sanctioned', e.target.value)}
            placeholder="0"
          />
          {clientErrors.amount_sanctioned && <span className="field-error">{clientErrors.amount_sanctioned}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="applied_date">
            Applied Date <span className="required">*</span>
          </label>
          <input
            id="applied_date"
            type="date"
            value={form.applied_date}
            onChange={(e) => handleChange('applied_date', e.target.value)}
          />
          {clientErrors.applied_date && <span className="field-error">{clientErrors.applied_date}</span>}
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="remarks">Remarks</label>
          <textarea
            id="remarks"
            rows={3}
            value={form.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            placeholder="Optional notes about this application..."
          />
        </div>
      </div>

      {serverErrors && serverErrors.length > 0 && (
        <div className="form-server-errors">
          {serverErrors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <ArrowLeft size={16} />
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          {submitting ? 'Saving...' : submitLabel || 'Save Application'}
        </button>
      </div>
    </form>
  );
}
