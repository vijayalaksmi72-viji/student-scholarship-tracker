// ============================================================
// api.test.js
// End-to-end API tests for the Scholarship Tracker backend.
// Run with: npm test  (inside /backend)
// ============================================================

const request = require('supertest');
const app = require('../server');

let createdId = null;

describe('Health check', () => {
  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('GET /api/applications', () => {
  it('should return a list of applications', async () => {
    const res = await request(app).get('/api/applications');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should filter by search term (student name)', async () => {
    const res = await request(app).get('/api/applications?search=Aarav');
    expect(res.statusCode).toBe(200);
    res.body.data.forEach((row) => {
      const matches =
        row.student_name.toLowerCase().includes('aarav') ||
        row.application_id.toLowerCase().includes('aarav');
      expect(matches).toBe(true);
    });
  });

  it('should filter by stage', async () => {
    const res = await request(app).get('/api/applications?stage=Disbursed');
    expect(res.statusCode).toBe(200);
    res.body.data.forEach((row) => {
      expect(row.stage).toBe('Disbursed');
    });
  });

  it('should return empty array for a non-matching search', async () => {
    const res = await request(app).get('/api/applications?search=ZZZNOMATCHZZZ');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it('should include a computed days_waiting field', async () => {
    const res = await request(app).get('/api/applications');
    expect(res.body.data[0]).toHaveProperty('days_waiting');
  });
});

describe('POST /api/applications', () => {
  it('should reject creation with missing required fields', async () => {
    const res = await request(app).post('/api/applications').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('should reject an invalid future applied_date', async () => {
    const res = await request(app).post('/api/applications').send({
      student_name: 'Test Student',
      scholarship_name: 'Test Scholarship',
      applied_date: '2099-01-01',
    });
    expect(res.statusCode).toBe(400);
  });

  it('should create a new application with valid data', async () => {
    const res = await request(app).post('/api/applications').send({
      student_name: 'Test Student E2E',
      email: 'teststudent@example.com',
      scholarship_name: 'Test Scholarship',
      category: 'Merit',
      amount_requested: 10000,
      stage: 'Submitted',
      applied_date: '2026-01-01',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('application_id');
    createdId = res.body.data.id;
  });
});

describe('GET /api/applications/:id', () => {
  it('should fetch the newly created application', async () => {
    const res = await request(app).get(`/api/applications/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.student_name).toBe('Test Student E2E');
  });

  it('should return 404 for a non-existent application', async () => {
    const res = await request(app).get('/api/applications/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('PUT /api/applications/:id', () => {
  it('should update an existing application', async () => {
    const res = await request(app).put(`/api/applications/${createdId}`).send({
      student_name: 'Test Student Updated',
      scholarship_name: 'Test Scholarship',
      stage: 'Approved',
      applied_date: '2026-01-01',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.student_name).toBe('Test Student Updated');
    expect(res.body.data.stage).toBe('Approved');
  });

  it('should return 404 when updating a non-existent application', async () => {
    const res = await request(app).put('/api/applications/999999').send({
      student_name: 'Ghost',
      scholarship_name: 'Ghost Scholarship',
      applied_date: '2026-01-01',
    });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/applications/:id', () => {
  it('should delete the created application', async () => {
    const res = await request(app).delete(`/api/applications/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 when fetching the deleted application', async () => {
    const res = await request(app).get(`/api/applications/${createdId}`);
    expect(res.statusCode).toBe(404);
  });
});
