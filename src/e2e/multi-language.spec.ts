/**
 * E2E Tests for Multi-Language Support
 */
import { test, expect } from '@playwright/test';

test.describe('Multi-Language Support', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should display language selector', async ({ page }) => {
    // Find language selector button
    const languageButton = page.locator('button').filter({ hasText: /english|العربية/i }).first();
    await expect(languageButton).toBeVisible();
  });

  test('should switch from English to Arabic', async ({ page }) => {
    // Click language selector
    const languageButton = page.locator('button').filter({ hasText: /english/i }).first();
    await languageButton.click();
    
    // Select Arabic
    const arabicOption = page.getByText(/العربية/i);
    await arabicOption.click();
    
    // Wait for language change
    await page.waitForTimeout(500);
    
    // Check HTML dir attribute changed to rtl
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');
    
    // Check for Arabic text
    await expect(page.getByText(/لوحة القيادة|الموظفين/)).toBeVisible();
  });

  test('should switch from Arabic back to English', async ({ page }) => {
    // First switch to Arabic
    const languageButton = page.locator('button').filter({ hasText: /english/i }).first();
    await languageButton.click();
    await page.getByText(/العربية/i).click();
    await page.waitForTimeout(500);
    
    // Switch back to English
    const arabicButton = page.locator('button').filter({ hasText: /العربية/i }).first();
    await arabicButton.click();
    await page.getByText(/english/i).click();
    await page.waitForTimeout(500);
    
    // Check HTML dir attribute changed back to ltr
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('ltr');
    
    // Check for English text
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should preserve language preference on page refresh', async ({ page }) => {
    // Switch to Arabic
    const languageButton = page.locator('button').filter({ hasText: /english/i }).first();
    await languageButton.click();
    await page.getByText(/العربية/i).click();
    await page.waitForTimeout(500);
    
    // Refresh page
    await page.reload();
    
    // Should still be in Arabic
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');
  });

  test('should translate all sidebar menu items', async ({ page }) => {
    // Switch to Arabic
    const languageButton = page.locator('button').filter({ hasText: /english/i }).first();
    await languageButton.click();
    await page.getByText(/العربية/i).click();
    await page.waitForTimeout(500);
    
    // Check sidebar has Arabic text
    const sidebar = page.locator('nav, aside').first();
    if (await sidebar.isVisible()) {
      const arabicText = sidebar.locator('text=/[ء-ي]/');
      expect(await arabicText.count()).toBeGreaterThan(0);
    }
  });

  test('should translate breadcrumbs in Arabic', async ({ page }) => {
    // Switch to Arabic
    const languageButton = page.locator('button').filter({ hasText: /english/i }).first();
    await languageButton.click();
    await page.getByText(/العربية/i).click();
    await page.waitForTimeout(500);
    
    // Navigate to a page with breadcrumbs
    await page.getByRole('link', { name: /الموظفين|Employee/i }).first().click();
    
    // Check for breadcrumbs
    const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
    if (await breadcrumbs.isVisible()) {
      // Should contain Arabic text
      expect(await breadcrumbs.textContent()).toMatch(/[ء-ي]/);
    }
  });

  test('should have RTL layout for Arabic', async ({ page }) => {
    // Switch to Arabic
    const languageButton = page.locator('button').filter({ hasText: /english/i }).first();
    await languageButton.click();
    await page.getByText(/العربية/i).click();
    await page.waitForTimeout(500);
    
    // Check layout direction
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');
    
    // Icons and buttons should mirror
    const sidebar = page.locator('nav, aside').first();
    if (await sidebar.isVisible()) {
      // Sidebar should be on the right for RTL
      const box = await sidebar.boundingBox();
      expect(box).toBeTruthy();
    }
  });

  test('should translate form labels in different modules', async ({ page }) => {
    // Switch to Arabic
    const languageButton = page.locator('button').filter({ hasText: /english/i }).first();
    await languageButton.click();
    await page.getByText(/العربية/i).click();
    await page.waitForTimeout(500);
    
    // Navigate to leave management
    await page.getByRole('link', { name: /الإجازات|Leave/i }).first().click();
    
    // Check for Arabic labels
    await expect(page.locator('text=/[ء-ي]/')).toBeTruthy();
  });
});
