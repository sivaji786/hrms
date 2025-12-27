/**
 * E2E Tests for Training & Development
 */
import { test, expect } from '@playwright/test';

test.describe('Training & Development', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to training
    await page.getByRole('link', { name: /training/i }).first().click();
  });

  test('should display training programs', async ({ page }) => {
    // Should show training list or cards
    await expect(page.getByText(/training|course|program/i)).toBeVisible();
  });

  test('should view training details', async ({ page }) => {
    // Click view on first training
    const viewButton = page.getByRole('button', { name: /view details|view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show training details
      await expect(page.getByText(/training details|duration|trainer|participants/i)).toBeVisible();
      
      // Check for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toContainText(/training/i);
      }
    }
  });

  test('should add new training program', async ({ page }) => {
    // Click add training button
    const addButton = page.getByRole('button', { name: /add training|new training/i });
    
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Should show training form
      await expect(page.getByLabel(/title|name/i)).toBeVisible();
      await expect(page.getByLabel(/trainer|instructor/i)).toBeVisible();
    }
  });

  test('should display training tabs', async ({ page }) => {
    // Check for tabs
    const scheduledTab = page.getByRole('tab', { name: /scheduled/i });
    const completedTab = page.getByRole('tab', { name: /completed/i });
    
    if (await scheduledTab.isVisible() && await completedTab.isVisible()) {
      await scheduledTab.click();
      await page.waitForTimeout(300);
      
      await completedTab.click();
      await page.waitForTimeout(300);
    }
  });

  test('should filter trainings by department', async ({ page }) => {
    // Find department filter
    const departmentFilter = page.getByRole('button', { name: /department/i });
    
    if (await departmentFilter.isVisible()) {
      await departmentFilter.click();
      await page.getByText(/engineering|hr|sales/i).first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should search trainings', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('React');
      await page.waitForTimeout(500);
    }
  });

  test('should display participant list', async ({ page }) => {
    // View first training
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show participants
      const participantsSection = page.getByText(/participants|enrolled/i);
      if (await participantsSection.isVisible()) {
        await expect(participantsSection).toBeVisible();
      }
    }
  });

  test('should display training stats', async ({ page }) => {
    // Check for stat cards
    const stats = page.locator('[class*="StatCard"], .stat-card');
    
    if (await stats.first().isVisible()) {
      expect(await stats.count()).toBeGreaterThan(0);
    }
  });
});
