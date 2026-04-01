import { test, expect } from '@playwright/test';
import { clearStorage } from './helpers.js';

test.describe('Signup / Employee Registration', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/signup');
  });

  test('should display registration form with all fields', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Create Account');
    await expect(page.locator('#firstName')).toBeVisible();
    await expect(page.locator('#lastName')).toBeVisible();
    await expect(page.locator('#signup-email')).toBeVisible();
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('#department')).toBeVisible();
    await expect(page.locator('#position')).toBeVisible();
    await expect(page.locator('#signup-password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('.field-error').first()).toBeVisible();
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.fill('#signup-password', 'ab');
    await expect(page.locator('.strength-weak')).toBeVisible();

    await page.fill('#signup-password', 'Abcd1234');
    await expect(page.locator('.strength-medium')).toBeVisible();

    await page.fill('#signup-password', 'Abcd1234@xyz!');
    await expect(page.locator('.strength-strong')).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#signup-email', 'test.new@company.com');
    await page.selectOption('#department', 'Engineering');
    await page.fill('#position', 'Developer');
    await page.fill('#signup-password', 'Test@1234');
    await page.fill('#confirmPassword', 'Different@1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('.field-error')).toContainText('Passwords do not match');
  });

  test('should register a new employee successfully', async ({ page }) => {
    await page.fill('#firstName', 'Alice');
    await page.fill('#lastName', 'Cooper');
    await page.fill('#signup-email', 'alice.cooper@company.com');
    await page.fill('#phone', '+1-555-0200');
    await page.selectOption('#department', 'Engineering');
    await page.fill('#position', 'Frontend Developer');
    await page.fill('#signup-password', 'Alice@1234');
    await page.fill('#confirmPassword', 'Alice@1234');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/employee/dashboard');
    await expect(page.getByTestId('employee-dashboard')).toBeVisible();
    await expect(page.getByTestId('header-greeting')).toContainText('Alice');
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    await page.fill('#firstName', 'Duplicate');
    await page.fill('#lastName', 'User');
    await page.fill('#signup-email', 'john.doe@hrportal.com');
    await page.selectOption('#department', 'Engineering');
    await page.fill('#position', 'Developer');
    await page.fill('#signup-password', 'Test@1234');
    await page.fill('#confirmPassword', 'Test@1234');
    await page.click('button[type="submit"]');
    await expect(page.getByTestId('signup-error')).toContainText('already exists');
  });

  test('should have link back to login', async ({ page }) => {
    await page.click('a[href="/login"]');
    await page.waitForURL('**/login');
    await expect(page.locator('h1')).toHaveText('Welcome Back');
  });
});
