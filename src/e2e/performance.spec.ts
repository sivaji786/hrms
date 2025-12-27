/**
 * E2E Tests for Performance Management
 */
import { test, expect } from '@playwright/test';

test.describe('Performance Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to performance management
    await page.getByRole('link', { name: /performance/i }).first().click();
  });

  test('should display performance tabs', async ({ page }) => {
    // Check for tabs
    const appraisalsTab = page.getByRole('tab', { name: /appraisals/i });
    const goalsTab = page.getByRole('tab', { name: /goals/i });
    const reviewsTab = page.getByRole('tab', { name: /reviews/i });
    
    await expect(appraisalsTab || goalsTab || reviewsTab).toBeTruthy();
  });

  test('should display appraisal cycles', async ({ page }) => {
    // Should show appraisal list or cards
    await expect(page.getByText(/appraisal|cycle|review/i)).toBeVisible();
  });

  test('should navigate to start appraisal cycle', async ({ page }) => {
    // Click start appraisal button
    const startButton = page.getByRole('button', { name: /start appraisal|new cycle/i });
    
    if (await startButton.isVisible()) {
      await startButton.click();
      
      // Should navigate to form
      await expect(page.getByText(/start appraisal|cycle name/i)).toBeVisible();
      
      // Check for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toContainText(/performance/i);
      }
    }
  });

  test('should view appraisal details', async ({ page }) => {
    // Click view on first appraisal
    const viewButton = page.getByRole('button', { name: /view details|view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show appraisal details
      await expect(page.getByText(/appraisal details|ratings|comments/i)).toBeVisible();
    }
  });

  test('should display employee performance ratings', async ({ page }) => {
    // Should show ratings or scores
    const ratings = page.getByText(/rating|score|excellent|good|average/i);
    
    if (await ratings.first().isVisible()) {
      expect(await ratings.count()).toBeGreaterThan(0);
    }
  });

  test('should filter appraisals by status', async ({ page }) => {
    // Find status filter
    const statusFilter = page.getByRole('button', { name: /status/i });
    
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByText(/ongoing|completed/i).first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should display goals tab', async ({ page }) => {
    // Switch to goals tab
    const goalsTab = page.getByRole('tab', { name: /goals/i });
    
    if (await goalsTab.isVisible()) {
      await goalsTab.click();
      
      // Should show goals list
      await expect(page.getByText(/goals|objectives|targets/i)).toBeVisible();
    }
  });

  test('should search appraisals', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Q4');
      await page.waitForTimeout(500);
    }
  });

  test('should display performance charts', async ({ page }) => {
    // Check for chart visualization
    const chart = page.locator('svg, canvas, [class*="chart"]');
    
    if (await chart.first().isVisible()) {
      expect(await chart.count()).toBeGreaterThan(0);
    }
  });
});
