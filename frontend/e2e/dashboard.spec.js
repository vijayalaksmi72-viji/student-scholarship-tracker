// ============================================================
// dashboard.spec.js
// End-to-end tests covering the full user journey:
// view dashboard -> search -> filter -> add -> edit -> delete.
//
// NOTE: These tests require both the backend (port 5000) and
// the frontend (port 5173, auto-started by Playwright) to be
// available. Run `npm run dev` in /backend separately first.
// ============================================================

import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('loads and displays the applications table', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Scholarship Applications' })).toBeVisible();
    await expect(page.locator('.app-table')).toBeVisible();
    await expect(page.locator('.app-table tbody tr').first()).toBeVisible();
  });

  test('shows summary stat cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.stat-card')).toHaveCount(4);
  });

  test('search filters the table by student name', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder(/search by student name/i).fill('Aarav');
    await page.waitForTimeout(500); // debounce
    const rows = page.locator('.app-table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('Aarav');
    }
  });

  test('search with no matches shows the "no matching records" empty state', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder(/search by student name/i).fill('ZZZNoSuchStudentZZZ');
    await page.waitForTimeout(500);
    await expect(page.getByText(/no matching records found/i)).toBeVisible();
  });

  test('filter dropdown narrows results by stage', async ({ page }) => {
    await page.goto('/');
    await page.locator('.filter-select').selectOption('Disbursed');
    await page.waitForTimeout(500);
    const badges = page.locator('.app-table tbody .badge');
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toHaveText('Disbursed');
    }
  });
});

test.describe('Add Application', () => {
  test('creates a new application end-to-end', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /add application/i }).first().click();
    await expect(page).toHaveURL(/\/add/);

    const uniqueName = `Playwright Test Student ${Date.now()}`;
    await page.fill('#student_name', uniqueName);
    await page.fill('#scholarship_name', 'E2E Test Scholarship');
    await page.selectOption('#category', 'Merit');
    await page.fill('#amount_requested', '15000');
    await page.fill('#applied_date', '2026-01-15');

    await page.getByRole('button', { name: /create application/i }).click();

    await expect(page.getByText(/created successfully/i)).toBeVisible();
    await expect(page).toHaveURL('http://localhost:5173/', { timeout: 5000 });

    await page.getByPlaceholder(/search by student name/i).fill(uniqueName);
    await page.waitForTimeout(500);
    await expect(page.locator('.app-table tbody tr')).toHaveCount(1);
  });

  test('shows client-side validation errors for empty required fields', async ({ page }) => {
    await page.goto('/add');
    await page.getByRole('button', { name: /create application/i }).click();
    await expect(page.getByText(/student name is required/i)).toBeVisible();
    await expect(page.getByText(/scholarship name is required/i)).toBeVisible();
  });
});

test.describe('Edit Application', () => {
  test('edits an existing application and reflects the change', async ({ page }) => {
    await page.goto('/');
    const firstRow = page.locator('.app-table tbody tr').first();
    await firstRow.locator('.action-edit').click();

    await expect(page).toHaveURL(/\/edit\//);
    const remarksField = page.locator('#remarks');
    await remarksField.fill('Updated via Playwright E2E test');
    await page.getByRole('button', { name: /update application/i }).click();

    await expect(page.getByText(/updated successfully/i)).toBeVisible();
    await expect(page).toHaveURL('http://localhost:5173/', { timeout: 5000 });
  });

  test('shows "not found" state for a non-existent application id', async ({ page }) => {
    await page.goto('/edit/999999');
    await expect(page.getByText(/application not found/i)).toBeVisible();
  });
});

test.describe('Delete Application', () => {
  test('deletes an application after confirmation', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder(/search by student name/i).fill('Playwright Test Student');
    await page.waitForTimeout(500);

    const row = page.locator('.app-table tbody tr').first();
    await expect(row).toBeVisible();
    await row.locator('.action-delete').click();

    await expect(page.getByText(/delete application\?/i)).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText(/no matching records found|no applications yet/i)).toBeVisible();
  });
});
