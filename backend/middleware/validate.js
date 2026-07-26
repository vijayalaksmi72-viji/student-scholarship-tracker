// ============================================================
// validate.js
// Server-side validation middleware for creating/updating
// scholarship applications.
// ============================================================

const ALLOWED_STAGES = [
  'Submitted',
  'Under Review',
  'Approved',
  'Disbursed',
  'Rejected',
];

const ALLOWED_CATEGORIES = ['Merit', 'Need-based', 'Sports', 'Minority'];

function isValidDate(value) {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function validateApplication(req, res, next) {
  const errors = [];
  const body = req.body || {};
  const isUpdate = req.method === 'PUT';

  const {
    student_name,
    scholarship_name,
    stage,
    applied_date,
    category,
    amount_requested,
    amount_sanctioned,
    email,
  } = body;

  // Required fields
  if (!student_name || typeof student_name !== 'string' || !student_name.trim()) {
    errors.push('Student name is required.');
  } else if (student_name.trim().length < 2) {
    errors.push('Student name must be at least 2 characters long.');
  }

  if (!scholarship_name || typeof scholarship_name !== 'string' || !scholarship_name.trim()) {
    errors.push('Scholarship name is required.');
  }

  if (!applied_date) {
    errors.push('Applied date is required.');
  } else if (!isValidDate(applied_date)) {
    errors.push('Applied date must be a valid date (YYYY-MM-DD).');
  } else if (new Date(applied_date) > new Date()) {
    errors.push('Applied date cannot be in the future.');
  }

  if (stage && !ALLOWED_STAGES.includes(stage)) {
    errors.push(`Stage must be one of: ${ALLOWED_STAGES.join(', ')}.`);
  }

  if (category && !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}.`);
  }

  if (
    amount_requested !== undefined &&
    amount_requested !== null &&
    amount_requested !== '' &&
    (isNaN(Number(amount_requested)) || Number(amount_requested) < 0)
  ) {
    errors.push('Amount requested must be a non-negative number.');
  }

  if (
    amount_sanctioned !== undefined &&
    amount_sanctioned !== null &&
    amount_sanctioned !== '' &&
    (isNaN(Number(amount_sanctioned)) || Number(amount_sanctioned) < 0)
  ) {
    errors.push('Amount sanctioned must be a non-negative number.');
  }

  if (email && typeof email === 'string' && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Email format is invalid.');
    }
  }

  if (!isUpdate && !body.application_id) {
    // application_id is auto-generated server-side on create, so this is
    // only a safety net if a caller supplies a blank string explicitly.
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = { validateApplication, ALLOWED_STAGES, ALLOWED_CATEGORIES };
