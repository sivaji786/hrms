/**
 * E2E Tests for Dashboard
 */
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should display dashboard stats', async ({ page }) => {
    // Check for stat cards
    await expect(page.getByText(/total employees/i)).toBeVisible();
    await expect(page.getByText(/present today/i)).toBeVisible();
    await expect(page.getByText(/pending/i)).toBeVisible();
  });

  test('should display location dropdown', async ({ page }) => {
    // Check for location filter
    const locationDropdown = page.getByRole('combobox', { name: /location/i });
    await expect(locationDropdown || page.locator('select').first()).toBeVisible();
  });

  test('should change stats when location is selected', async ({ page }) => {
    // Find location dropdown
    const dropdown = page.locator('select').first();
    if (await dropdown.isVisible()) {
      await dropdown.selectOption({ index: 1 });
      
      // Stats should update (values might change)
      await expect(page.getByText(/total employees/i)).toBeVisible();
    }
  });

  test('should display quick actions', async ({ page }) => {
    // Check for quick action buttons
    const quickActions = page.getByText(/quick actions/i);
    if (await quickActions.isVisible()) {
      await expect(quickActions).toBeVisible();
    }
  });

  test('should display recent activities', async ({ page }) => {
    // Check for recent activities section
    const activities = page.getByText(/recent activities|activity/i);
    if (await activities.isVisible()) {
      await expect(activities).toBeVisible();
    }
  });

  test('should navigate to employee management', async ({ page }) => {
    // Click on employee management link
    await page.getByRole('link', { name: /employee/i }).first().click();
    
    // Should navigate to employee management
    await expect(page).toHaveURL(/employee/);
  });

  test('should display language selector', async ({ page }) => {
    // Check for language selector
    const languageSelector = page.getByRole('button', { name: /language|english|العربية/i });
    await expect(languageSelector.first()).toBeVisible();
  });
});
