// ============================================================
// routes/applications.js
// Express router for all /applications endpoints.
// ============================================================

const express = require('express');
const router = express.Router();

const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationsController');

const { validateApplication } = require('../middleware/validate');

router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.post('/', validateApplication, createApplication);
router.put('/:id', validateApplication, updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
