import { test, expect } from '@playwright/test';
import { clearStorage, loginAsHR, loginAsEmployee } from './helpers.js';

test.describe('HR Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await loginAsHR(page);
  });

  test('should display HR dashboard with statistics', async ({ page }) => {
    await expect(page.getByTestId('hr-dashboard')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('HR Dashboard');

    // Should show 4 stat cards
    const statCards = page.locator('.stat-card');
    await expect(statCards).toHaveCount(4);
  });

  test('should show correct employee count', async ({ page }) => {
    // Seed data has 3 employees
    const primaryStat = page.locator('.stat-primary .stat-value');
    await expect(primaryStat).toHaveText('3');
  });

  test('should display recent employees table', async ({ page }) => {
    await expect(page.locator('.card-header h3', { hasText: 'Recent Employees' })).toBeVisible();
  });

  test('should display recent leave requests table', async ({ page }) => {
    await expect(page.locator('.card-header h3', { hasText: 'Recent Leave Requests' })).toBeVisible();
  });

  test('should navigate to employees page via View All', async ({ page }) => {
    await page.click('a[href="/hr/employees"]');
    await page.waitForURL('**/hr/employees');
    await expect(page.getByTestId('employee-list')).toBeVisible();
  });

  test('should navigate to leave management via View All', async ({ page }) => {
    await page.click('a[href="/hr/leave-management"]');
    await page.waitForURL('**/hr/leave-management');
    await expect(page.getByTestId('leave-management')).toBeVisible();
  });
});

test.describe('Employee Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await loginAsEmployee(page);
  });

  test('should display employee dashboard with welcome message', async ({ page }) => {
    await expect(page.getByTestId('employee-dashboard')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Welcome, John');
  });

  test('should show leave statistics', async ({ page }) => {
    const statCards = page.locator('.stat-card');
    await expect(statCards).toHaveCount(4);
  });

  test('should display profile summary', async ({ page }) => {
    await expect(page.locator('.profile-summary')).toBeVisible();
    await expect(page.locator('.profile-details')).toContainText('John Doe');
    await expect(page.locator('.profile-details')).toContainText('Engineering');
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.click('a[href="/employee/profile"]');
    await page.waitForURL('**/employee/profile');
    await expect(page.getByTestId('employee-profile')).toBeVisible();
  });

  test('should navigate to leave page', async ({ page }) => {
    await page.click('a[href="/employee/leave"]');
    await page.waitForURL('**/employee/leave');
    await expect(page.getByTestId('employee-leave')).toBeVisible();
  });
});
