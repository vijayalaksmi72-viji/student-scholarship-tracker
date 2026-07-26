// ============================================================
// applicationsController.js
// Business logic for all /applications endpoints.
// ============================================================

const db = require('../db');
const { calculateDaysWaiting } = require('../utils/daysWaiting');

function attachDaysWaiting(row) {
  return {
    ...row,
    days_waiting: calculateDaysWaiting(row.applied_date, row.stage, row.last_updated),
  };
}

function generateApplicationId() {
  const year = new Date().getFullYear();
  const row = db
    .prepare(
      `SELECT application_id FROM applications
       WHERE application_id LIKE ?
       ORDER BY id DESC LIMIT 1`
    )
    .get(`SCH-${year}-%`);

  let nextNumber = 1;
  if (row && row.application_id) {
    const parts = row.application_id.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) nextNumber = lastNum + 1;
  }
  return `SCH-${year}-${String(nextNumber).padStart(3, '0')}`;
}

// GET /applications
// Supports ?search=&stage=&category=&page=&limit=
function getAllApplications(req, res) {
  try {
    const { search, stage, category } = req.query;

    let query = 'SELECT * FROM applications WHERE 1=1';
    const params = [];

    if (search && search.trim()) {
      query += ' AND (student_name LIKE ? OR application_id LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    if (stage && stage.trim() && stage !== 'All') {
      query += ' AND stage = ?';
      params.push(stage.trim());
    }

    if (category && category.trim() && category !== 'All') {
      query += ' AND category = ?';
      params.push(category.trim());
    }

    query += ' ORDER BY id DESC';

    const rows = db.prepare(query).all(...params);
    const data = rows.map(attachDaysWaiting);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error('[getAllApplications] error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applications.',
      error: err.message,
    });
  }
}

// GET /applications/:id
function getApplicationById(req, res) {
  try {
    const { id } = req.params;
    const row = db
      .prepare('SELECT * FROM applications WHERE id = ? OR application_id = ?')
      .get(id, id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: `Application with id "${id}" was not found.`,
      });
    }

    return res.status(200).json({ success: true, data: attachDaysWaiting(row) });
  } catch (err) {
    console.error('[getApplicationById] error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch application.',
      error: err.message,
    });
  }
}

// POST /applications
function createApplication(req, res) {
  try {
    const {
      student_name,
      email,
      phone,
      scholarship_name,
      category,
      amount_requested,
      amount_sanctioned,
      stage,
      applied_date,
      remarks,
    } = req.body;

    const application_id = generateApplicationId();
    const today = new Date().toISOString().slice(0, 10);
    const finalStage = stage || 'Submitted';

    const stmt = db.prepare(`
      INSERT INTO applications
      (application_id, student_name, email, phone, scholarship_name, category,
       amount_requested, amount_sanctioned, stage, applied_date, last_updated, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      application_id,
      student_name.trim(),
      email || null,
      phone || null,
      scholarship_name.trim(),
      category || null,
      amount_requested === '' || amount_requested === undefined ? null : Number(amount_requested),
      amount_sanctioned === '' || amount_sanctioned === undefined ? null : Number(amount_sanctioned),
      finalStage,
      applied_date,
      today,
      remarks || null
    );

    const created = db.prepare('SELECT * FROM applications WHERE id = ?').get(info.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Application created successfully.',
      data: attachDaysWaiting(created),
    });
  } catch (err) {
    console.error('[createApplication] error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create application.',
      error: err.message,
    });
  }
}

// PUT /applications/:id
function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const existing = db
      .prepare('SELECT * FROM applications WHERE id = ? OR application_id = ?')
      .get(id, id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Application with id "${id}" was not found.`,
      });
    }

    const {
      student_name,
      email,
      phone,
      scholarship_name,
      category,
      amount_requested,
      amount_sanctioned,
      stage,
      applied_date,
      remarks,
    } = req.body;

    const today = new Date().toISOString().slice(0, 10);

    const stmt = db.prepare(`
      UPDATE applications SET
        student_name = ?,
        email = ?,
        phone = ?,
        scholarship_name = ?,
        category = ?,
        amount_requested = ?,
        amount_sanctioned = ?,
        stage = ?,
        applied_date = ?,
        last_updated = ?,
        remarks = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(
      student_name.trim(),
      email || null,
      phone || null,
      scholarship_name.trim(),
      category || null,
      amount_requested === '' || amount_requested === undefined ? null : Number(amount_requested),
      amount_sanctioned === '' || amount_sanctioned === undefined ? null : Number(amount_sanctioned),
      stage || existing.stage,
      applied_date,
      today,
      remarks || null,
      existing.id
    );

    const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(existing.id);

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      data: attachDaysWaiting(updated),
    });
  } catch (err) {
    console.error('[updateApplication] error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update application.',
      error: err.message,
    });
  }
}

// DELETE /applications/:id
function deleteApplication(req, res) {
  try {
    const { id } = req.params;
    const existing = db
      .prepare('SELECT * FROM applications WHERE id = ? OR application_id = ?')
      .get(id, id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Application with id "${id}" was not found.`,
      });
    }

    db.prepare('DELETE FROM applications WHERE id = ?').run(existing.id);

    return res.status(200).json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (err) {
    console.error('[deleteApplication] error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete application.',
      error: err.message,
    });
  }
}

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
