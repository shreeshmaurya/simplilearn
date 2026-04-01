import { test, expect } from '@playwright/test';
import { clearStorage } from './helpers.js';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/login');
  });

  test('should display login page with form elements', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Welcome Back');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign In');
  });

  test('should show demo credentials', async ({ page }) => {
    await expect(page.locator('.demo-credentials')).toContainText('admin@hrportal.com');
    await expect(page.locator('.demo-credentials')).toContainText('john.doe@hrportal.com');
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Type an invalid email using the React-compatible approach
    await page.locator('#email').pressSequentially('invalid-email');
    await page.fill('#password', 'somepassword');
    // Dispatch submit event programmatically to bypass HTML5 validation
    await page.locator('[data-testid="login-form"]').evaluate((form) => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await expect(page.getByTestId('login-error')).toHaveText('Please enter a valid email address');
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.fill('#email', 'wrong@email.com');
    await page.fill('#password', 'WrongPass@1');
    await page.click('button[type="submit"]');
    await expect(page.getByTestId('login-error')).toHaveText('No account found with this email');
  });

  test('should show error for wrong password', async ({ page }) => {
    await page.fill('#email', 'admin@hrportal.com');
    await page.fill('#password', 'WrongPass@1');
    await page.click('button[type="submit"]');
    await expect(page.getByTestId('login-error')).toHaveText('Incorrect password');
  });

  test('should login HR user and redirect to HR dashboard', async ({ page }) => {
    await page.fill('#email', 'admin@hrportal.com');
    await page.fill('#password', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/hr/dashboard');
    await expect(page.getByTestId('hr-dashboard')).toBeVisible();
    await expect(page.getByTestId('header-greeting')).toContainText('Sarah');
  });

  test('should login employee and redirect to employee dashboard', async ({ page }) => {
    await page.fill('#email', 'john.doe@hrportal.com');
    await page.fill('#password', 'Employee@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/employee/dashboard');
    await expect(page.getByTestId('employee-dashboard')).toBeVisible();
    await expect(page.getByTestId('header-greeting')).toContainText('John');
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('a[href="/signup"]');
    await page.waitForURL('**/signup');
    await expect(page.locator('h1')).toHaveText('Create Account');
  });

  test('should logout successfully', async ({ page }) => {
    await page.fill('#email', 'admin@hrportal.com');
    await page.fill('#password', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/hr/dashboard');
    await page.getByTestId('logout-btn').click();
    await page.waitForURL('**/login');
    await expect(page.locator('h1')).toHaveText('Welcome Back');
  });
});
