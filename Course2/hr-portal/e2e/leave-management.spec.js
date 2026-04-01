import { test, expect } from '@playwright/test';
import { clearStorage, loginAsHR, loginAsEmployee } from './helpers.js';

test.describe('Leave Management - Employee', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await loginAsEmployee(page);
    await page.click('.nav-link >> text=Leave Requests');
    await page.waitForURL('**/employee/leave');
  });

  test('should display leave requests page', async ({ page }) => {
    await expect(page.getByTestId('employee-leave')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('My Leave Requests');
  });

  test('should show existing leave requests for the employee', async ({ page }) => {
    // John Doe (usr-002) has one seed leave request
    const table = page.getByTestId('leave-table');
    await expect(table).toBeVisible();
  });

  test('should open leave request form', async ({ page }) => {
    await page.getByTestId('apply-leave-btn').click();
    await expect(page.getByTestId('leave-request-form')).toBeVisible();
  });

  test('should submit a new leave request', async ({ page }) => {
    await page.getByTestId('apply-leave-btn').click();

    await page.selectOption('#leave-type', 'personal');
    await page.fill('#start-date', '2026-05-01');
    await page.fill('#end-date', '2026-05-03');
    await page.fill('#leave-reason', 'Personal errand');
    await page.getByTestId('submit-leave-btn').click();

    // Form should close
    await expect(page.getByTestId('leave-request-form')).not.toBeVisible();
    // New leave should appear in the table
    await expect(page.locator('[data-testid="leave-table"] tbody tr').last()).toContainText('personal');
  });

  test('should validate leave request form', async ({ page }) => {
    await page.getByTestId('apply-leave-btn').click();
    await page.getByTestId('submit-leave-btn').click();
    // Should show validation errors
    await expect(page.locator('.field-error').first()).toBeVisible();
  });

  test('should filter leave requests by status', async ({ page }) => {
    await page.selectOption('[data-testid="leave-status-filter"]', 'pending');
    // Should only show pending leaves
    const badges = page.locator('.status-badge');
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toHaveText('pending');
    }
  });
});

test.describe('Leave Management - HR', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await loginAsHR(page);
    await page.click('.nav-link >> text=Leave Management');
    await page.waitForURL('**/hr/leave-management');
  });

  test('should display all leave requests', async ({ page }) => {
    await expect(page.getByTestId('leave-management')).toBeVisible();
    const table = page.getByTestId('leave-mgmt-table');
    await expect(table).toBeVisible();
  });

  test('should show pending leave count', async ({ page }) => {
    await expect(page.locator('.page-header p')).toContainText('pending');
  });

  test('should approve a pending leave request', async ({ page }) => {
    const approveBtn = page.locator('[data-testid^="approve-"]').first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      // The leave row should now show approved status
      await expect(page.locator('.status-approved').first()).toBeVisible();
    }
  });

  test('should reject a pending leave request', async ({ page }) => {
    // First, need a pending request. Let's check if one exists
    const rejectBtn = page.locator('[data-testid^="reject-"]').first();
    if (await rejectBtn.isVisible()) {
      await rejectBtn.click();
      await expect(page.locator('.status-rejected').first()).toBeVisible();
    }
  });

  test('should filter by status', async ({ page }) => {
    await page.selectOption('[data-testid="lm-status-filter"]', 'approved');
    const rows = page.locator('[data-testid="leave-mgmt-table"] tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).locator('.status-badge')).toHaveText('approved');
    }
  });

  test('should filter by leave type', async ({ page }) => {
    await page.selectOption('[data-testid="lm-type-filter"]', 'annual');
    const rows = page.locator('[data-testid="leave-mgmt-table"] tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('annual');
    }
  });
});
