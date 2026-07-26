// ============================================================
// api.js
// Central Axios instance + API helper functions for the
// Scholarship Tracker frontend.
// ============================================================

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Normalize errors so components can render a friendly message.
function normalizeError(err) {
  if (err.response) {
    const message =
      (err.response.data && (err.response.data.message || (err.response.data.errors || []).join(' '))) ||
      'Something went wrong on the server.';
    return { message, status: err.response.status, errors: err.response.data?.errors || [] };
  }
  if (err.request) {
    return { message: 'Unable to reach the server. Please check your connection.', status: 0, errors: [] };
  }
  return { message: err.message || 'Unexpected error occurred.', status: 0, errors: [] };
}

export async function fetchApplications({ search = '', stage = '', category = '' } = {}) {
  try {
    const params = {};
    if (search) params.search = search;
    if (stage) params.stage = stage;
    if (category) params.category = category;
    const res = await client.get('/applications', { params });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function fetchApplicationById(id) {
  try {
    const res = await client.get(`/applications/${id}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function createApplication(payload) {
  try {
    const res = await client.post('/applications', payload);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateApplication(id, payload) {
  try {
    const res = await client.put(`/applications/${id}`, payload);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function deleteApplication(id) {
  try {
    const res = await client.delete(`/applications/${id}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export default client;
