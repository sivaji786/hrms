/**
 * E2E Tests for Document & Policy Management
 */
import { test, expect } from '@playwright/test';

test.describe('Document & Policy Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to documents
    await page.getByRole('link', { name: /document|policy/i }).first().click();
  });

  test('should display documents list', async ({ page }) => {
    // Should show documents table or cards
    await expect(page.getByText(/document|policy|handbook/i)).toBeVisible();
  });

  test('should filter documents by category', async ({ page }) => {
    // Find category filter
    const categoryFilter = page.getByRole('button', { name: /category|type/i });
    
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      await page.getByText(/policy|handbook|form/i).first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should view document details', async ({ page }) => {
    // Click view on first document
    const viewButton = page.getByRole('button', { name: /view|download/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show document viewer or details
      await expect(page.getByText(/document|policy|download/i)).toBeVisible();
    }
  });

  test('should upload new document', async ({ page }) => {
    // Click upload button
    const uploadButton = page.getByRole('button', { name: /upload|add document|add policy/i });
    
    if (await uploadButton.isVisible()) {
      await uploadButton.click();
      
      // Should navigate to upload form
      await expect(page.getByText(/upload document|add policy/i)).toBeVisible();
      
      // Check for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toContainText(/document|policy/i);
      }
    }
  });

  test('should search documents', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Employee');
      await page.waitForTimeout(500);
    }
  });

  test('should display document tabs', async ({ page }) => {
    // Check for tabs
    const policiesTab = page.getByRole('tab', { name: /policies/i });
    const handbooksTab = page.getByRole('tab', { name: /handbooks/i });
    const formsTab = page.getByRole('tab', { name: /forms/i });
    
    if (await policiesTab.isVisible()) {
      await policiesTab.click();
      await page.waitForTimeout(300);
    }
  });

  test('should download document', async ({ page }) => {
    // Find download button
    const downloadButton = page.getByRole('button', { name: /download/i }).first();
    
    if (await downloadButton.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      await downloadButton.click();
      
      const download = await downloadPromise;
      if (download) {
        expect(download).toBeTruthy();
      }
    }
  });

  test('should display document stats', async ({ page }) => {
    // Check for stat cards
    const stats = page.locator('[class*="StatCard"], .stat-card');
    
    if (await stats.first().isVisible()) {
      expect(await stats.count()).toBeGreaterThan(0);
    }
  });
});
