import { test, expect } from '@playwright/test';
import { clearStorage, loginAsHR } from './helpers.js';

test.describe('Employee Management (HR)', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await loginAsHR(page);
    await page.click('.nav-link >> text=Employees');
    await page.waitForURL('**/hr/employees');
  });

  test('should display employee list with table', async ({ page }) => {
    await expect(page.getByTestId('employee-list')).toBeVisible();
    await expect(page.getByTestId('employees-table')).toBeVisible();
    // Should have seed employees (3 employees, excluding the HR user)
    const rows = page.locator('[data-testid="employees-table"] tbody tr');
    await expect(rows).toHaveCount(3);
  });

  test('should search employees by name', async ({ page }) => {
    await page.fill('[data-testid="employee-search"]', 'John');
    const rows = page.locator('[data-testid="employees-table"] tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('John Doe');
  });

  test('should filter employees by department', async ({ page }) => {
    await page.selectOption('[data-testid="dept-filter"]', 'Marketing');
    const rows = page.locator('[data-testid="employees-table"] tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Jane Smith');
  });

  test('should open add employee form', async ({ page }) => {
    await page.getByTestId('add-employee-btn').click();
    await expect(page.getByTestId('employee-form')).toBeVisible();
    await expect(page.locator('.modal-header h2')).toHaveText('Add New Employee');
  });

  test('should add a new employee', async ({ page }) => {
    await page.getByTestId('add-employee-btn').click();
    await page.fill('#emp-firstName', 'New');
    await page.fill('#emp-lastName', 'Employee');
    await page.fill('#emp-email', 'new.employee@test.com');
    await page.fill('#emp-phone', '+1-555-9999');
    await page.selectOption('#emp-department', 'Sales');
    await page.fill('#emp-position', 'Sales Rep');
    await page.fill('#emp-password', 'NewEmp@1234');
    await page.getByTestId('save-employee-btn').click();

    // Modal should close and new employee should appear
    await expect(page.getByTestId('employee-form')).not.toBeVisible();
    const rows = page.locator('[data-testid="employees-table"] tbody tr');
    await expect(rows).toHaveCount(4);
  });

  test('should edit an existing employee', async ({ page }) => {
    // Click edit on the first employee row's edit button
    const firstEditBtn = page.locator('[data-testid^="edit-"]').first();
    await firstEditBtn.click();
    await expect(page.locator('.modal-header h2')).toHaveText('Edit Employee');

    await page.fill('#emp-position', 'Lead Developer');
    await page.getByTestId('save-employee-btn').click();
    await expect(page.getByTestId('employee-form')).not.toBeVisible();
  });

  test('should delete an employee with confirmation', async ({ page }) => {
    const initialRows = await page.locator('[data-testid="employees-table"] tbody tr').count();
    const firstDeleteBtn = page.locator('[data-testid^="delete-"]').first();
    await firstDeleteBtn.click();

    // Confirmation modal should appear
    await expect(page.getByTestId('delete-confirm-modal')).toBeVisible();
    await page.getByTestId('confirm-delete-btn').click();

    // Employee should be removed
    const finalRows = await page.locator('[data-testid="employees-table"] tbody tr').count();
    expect(finalRows).toBe(initialRows - 1);
  });

  test('should show empty state when search has no results', async ({ page }) => {
    await page.fill('[data-testid="employee-search"]', 'xyznonexistent');
    await expect(page.locator('.empty-state')).toBeVisible();
  });
});
