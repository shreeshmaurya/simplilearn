import { test, expect } from '@playwright/test';
import { clearStorage, loginAsHR, loginAsEmployee } from './helpers.js';

test.describe('Role-Based Access Control', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/hr/dashboard');
    await page.waitForURL('**/login');
    await expect(page.locator('h1')).toHaveText('Welcome Back');
  });

  test('should redirect unauthenticated users from employee routes to login', async ({ page }) => {
    await page.goto('/employee/dashboard');
    await page.waitForURL('**/login');
  });

  test('should redirect employee away from HR routes', async ({ page }) => {
    await loginAsEmployee(page);
    await page.goto('/hr/dashboard');
    await page.waitForURL('**/employee/dashboard');
  });

  test('should redirect HR away from employee routes', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/employee/dashboard');
    await page.waitForURL('**/hr/dashboard');
  });

  test('HR should see HR-specific navigation links', async ({ page }) => {
    await loginAsHR(page);
    await expect(page.locator('.nav-link', { hasText: 'Employees' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Leave Management' })).toBeVisible();
  });

  test('Employee should see employee-specific navigation links', async ({ page }) => {
    await loginAsEmployee(page);
    await expect(page.locator('.nav-link', { hasText: 'My Profile' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Leave Requests' })).toBeVisible();
  });

  test('HR role badge should display correctly', async ({ page }) => {
    await loginAsHR(page);
    await expect(page.locator('.role-hr')).toHaveText('HR');
  });

  test('Employee role badge should display correctly', async ({ page }) => {
    await loginAsEmployee(page);
    await expect(page.locator('.role-employee')).toHaveText('Employee');
  });
});
