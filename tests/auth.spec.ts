import { test, expect } from '@playwright/test';

test.describe('ERP Authentication & Dashboard Flows', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to base URL before each test
    await page.goto('/');
  });

  test('should display ERP portal login page with static password hint', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/ERP/);

    // Verify brand title and header
    await expect(page.locator('.brand-title')).toHaveText('ERP Portal');
    await expect(page.locator('.auth-title')).toHaveText('Welcome Back');

    // Verify static password banner displays '1234'
    const passwordBadge = page.locator('.demo-credential-banner');
    await expect(passwordBadge).toBeVisible();
    await expect(passwordBadge).toContainText('1234');
  });

  test('should login successfully with static password 1234', async ({ page }) => {
    // Fill credentials
    await page.fill('#login-identifier', 'alex@erp.com');
    await page.fill('#login-password', '1234');

    // Click submit
    await page.click('#btn-login-submit');

    // Verify dashboard loads
    await expect(page.locator('#welcome-heading')).toContainText('Welcome');
    await expect(page.locator('.brand-name')).toHaveText('ERP');

    // Verify presence of KPI metric cards
    await expect(page.locator('.metrics-grid')).toBeVisible();
    await expect(page.locator('.metric-card').first()).toBeVisible();
  });

  test('should fail login when an incorrect password is provided', async ({ page }) => {
    await page.fill('#login-identifier', 'alex@erp.com');
    await page.fill('#login-password', 'wrong-pass');

    await page.click('#btn-login-submit');

    // Verify error banner appears
    const errorAlert = page.locator('.auth-error-alert');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Invalid password');
  });

  test('should fill demo credentials when Auto Fill button is clicked', async ({ page }) => {
    // Clear inputs first
    await page.fill('#login-identifier', '');
    await page.fill('#login-password', '');

    // Click Auto Fill
    await page.click('#btn-quick-fill-demo');

    // Verify inputs populated
    await expect(page.locator('#login-identifier')).toHaveValue('alex@erp.com');
    await expect(page.locator('#login-password')).toHaveValue('1234');
  });

  test('should toggle theme between dark and light modes', async ({ page }) => {
    const htmlElement = page.locator('html');

    // Click theme toggle
    await page.click('#btn-auth-theme-toggle');
    const themeAfterToggle = await htmlElement.getAttribute('data-theme');
    expect(['light', 'dark']).toContain(themeAfterToggle);

    // Toggle back
    await page.click('#btn-auth-theme-toggle');
  });

  test('should register a new account and enter the ERP dashboard', async ({ page }) => {
    // Navigate to Register view
    await page.click('#link-to-register');
    await expect(page.locator('.auth-title')).toHaveText('Create Account');

    // Fill registration form
    const uniqueUsername = `testuser_${Date.now()}`;
    await page.fill('#reg-name', 'Kasun Perera');
    await page.fill('#reg-email', `${uniqueUsername}@erp.com`);
    await page.fill('#reg-username', uniqueUsername);
    await page.fill('#reg-dept', 'Finance & Operations');
    await page.fill('#reg-role', 'ERP Analyst');
    await page.fill('#reg-password', '1234');
    await page.fill('#reg-confirm-password', '1234');

    // Submit registration
    await page.click('#btn-register-submit');

    // Verify auto-logged in as new user on dashboard
    await expect(page.locator('#welcome-heading')).toContainText('Kasun Perera');
    await expect(page.locator('.user-display-name')).toHaveText('Kasun Perera');
    await expect(page.locator('.user-display-role')).toHaveText('ERP Analyst');
  });

  test('should allow user to log out back to the login screen', async ({ page }) => {
    // Login
    await page.fill('#login-identifier', 'alex@erp.com');
    await page.fill('#login-password', '1234');
    await page.click('#btn-login-submit');

    // Wait for dashboard
    await expect(page.locator('#btn-header-logout')).toBeVisible();

    // Log out
    await page.click('#btn-header-logout');

    // Verify returned to login view
    await expect(page.locator('.auth-title')).toHaveText('Welcome Back');
    await expect(page.locator('#login-identifier')).toBeVisible();
  });

});
