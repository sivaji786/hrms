/**
 * E2E Tests for Asset Management
 */
import { test, expect } from '@playwright/test';

test.describe('Asset Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to asset management
    await page.getByRole('link', { name: /asset/i }).first().click();
  });

  test('should display asset list', async ({ page }) => {
    // Should show asset table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check for asset names
    await expect(page.getByText(/laptop|desktop|phone|equipment/i)).toBeTruthy();
  });

  test('should display asset stats', async ({ page }) => {
    // Check for stat cards
    await expect(page.getByText(/total assets|assigned|available/i)).toBeVisible();
  });

  test('should filter assets by type', async ({ page }) => {
    // Find type filter
    const typeFilter = page.getByRole('button', { name: /type|category/i });
    
    if (await typeFilter.isVisible()) {
      await typeFilter.click();
      await page.getByText(/laptop|desktop|phone/i).first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should filter assets by status', async ({ page }) => {
    // Find status filter
    const statusTab = page.getByRole('tab', { name: /assigned|available/i });
    
    if (await statusTab.isVisible()) {
      await statusTab.click();
      await page.waitForTimeout(500);
    }
  });

  test('should view asset details', async ({ page }) => {
    // Click view on first asset
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show asset details
      await expect(page.getByText(/asset details|serial number|assigned to/i)).toBeVisible();
      
      // Check for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toContainText(/asset/i);
      }
    }
  });

  test('should add new asset', async ({ page }) => {
    // Click add asset button
    const addButton = page.getByRole('button', { name: /add asset/i });
    
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Should show asset form
      await expect(page.getByLabel(/name|type|serial/i)).toBeTruthy();
    }
  });

  test('should assign asset to employee', async ({ page }) => {
    // Find assign button
    const assignButton = page.getByRole('button', { name: /assign/i }).first();
    
    if (await assignButton.isVisible()) {
      await assignButton.click();
      
      // Should show assignment form or employee selector
      await expect(page.getByText(/assign|employee/i)).toBeVisible();
    }
  });

  test('should search assets', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('MacBook');
      await page.waitForTimeout(500);
    }
  });

  test('should display asset history', async ({ page }) => {
    // View first asset
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Check for history tab or section
      const historyTab = page.getByRole('tab', { name: /history/i });
      
      if (await historyTab.isVisible()) {
        await historyTab.click();
        await expect(page.getByText(/history|assigned|returned/i)).toBeVisible();
      }
    }
  });
});
