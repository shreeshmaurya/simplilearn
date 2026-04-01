// Shared test helpers

export async function clearStorage(page) {
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

export async function loginAsHR(page) {
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#email', 'admin@hrportal.com');
  await page.fill('#password', 'Admin@123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/hr/dashboard');
}

export async function loginAsEmployee(page) {
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#email', 'john.doe@hrportal.com');
  await page.fill('#password', 'Employee@123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/employee/dashboard');
}
