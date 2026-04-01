import { test, expect } from '@playwright/test';
import { clearStorage, loginAsEmployee } from './helpers.js';

test.describe('Employee Profile', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await loginAsEmployee(page);
    await page.click('.nav-link >> text=My Profile');
    await page.waitForURL('**/employee/profile');
  });

  test('should display profile information', async ({ page }) => {
    await expect(page.getByTestId('employee-profile')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('My Profile');
    await expect(page.locator('.profile-details-lg')).toContainText('John Doe');
    await expect(page.locator('.profile-details-lg')).toContainText('john.doe@hrportal.com');
    await expect(page.locator('.profile-details-lg')).toContainText('Engineering');
    await expect(page.locator('.profile-details-lg')).toContainText('Senior Developer');
  });

  test('should show avatar with initials', async ({ page }) => {
    await expect(page.locator('.profile-avatar-xl')).toHaveText('JD');
  });

  test('should switch to edit mode', async ({ page }) => {
    await page.getByTestId('edit-profile-btn').click();
    await expect(page.locator('#prof-firstName')).toBeVisible();
    await expect(page.locator('#prof-lastName')).toBeVisible();
    await expect(page.locator('#prof-phone')).toBeVisible();
  });

  test('should save profile changes', async ({ page }) => {
    await page.getByTestId('edit-profile-btn').click();
    await page.fill('#prof-phone', '+1-555-9999');
    await page.getByTestId('save-profile-btn').click();

    // Should show success message
    await expect(page.locator('.alert-success')).toContainText('Profile updated');
    // Should exit edit mode
    await expect(page.locator('.profile-details-lg')).toContainText('+1-555-9999');
  });

  test('should cancel edit mode', async ({ page }) => {
    await page.getByTestId('edit-profile-btn').click();
    await page.fill('#prof-firstName', 'Changed');
    await page.click('button:has-text("Cancel")');

    // Should revert and show original data
    await expect(page.locator('.profile-details-lg')).toContainText('John');
  });

  test('should have disabled fields for department and position', async ({ page }) => {
    await page.getByTestId('edit-profile-btn').click();
    await expect(page.locator('#prof-department')).toBeDisabled();
    await expect(page.locator('#prof-position')).toBeDisabled();
  });
});
