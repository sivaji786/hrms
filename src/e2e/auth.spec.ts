/**
 * E2E Tests for Authentication
 */
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test('should login as admin successfully', async ({ page }) => {
    await page.goto('/');
    
    // Fill login form
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    
    // Click login button
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    await page.getByPlaceholder(/email/i).fill('wrong@email.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test('should switch to employee login', async ({ page }) => {
    await page.goto('/');
    
    // Click switch to employee login
    await page.getByText(/employee/i).click();
    
    // Verify employee login form
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  });

  test('should login as employee successfully', async ({ page }) => {
    await page.goto('/');
    
    // Switch to employee login
    await page.getByText(/employee/i).click();
    
    // Fill employee credentials
    await page.getByPlaceholder(/email/i).fill('employee@company.com');
    await page.getByPlaceholder(/password/i).fill('emp123');
    
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should redirect to employee portal
    await expect(page).toHaveURL(/employee|portal/);
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/');
    
    // Login first
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for dashboard
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Logout
    await page.getByRole('button', { name: /logout/i }).click();
    
    // Should redirect to login
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });
});
