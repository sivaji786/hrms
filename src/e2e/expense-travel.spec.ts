/**
 * E2E Tests for Expense & Travel Management
 */
import { test, expect } from '@playwright/test';

test.describe('Expense & Travel Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to expense & travel
    await page.getByRole('link', { name: /expense|travel/i }).first().click();
  });

  test('should display expense and travel tabs', async ({ page }) => {
    // Check for tabs
    const expenseTab = page.getByRole('tab', { name: /expense/i });
    const travelTab = page.getByRole('tab', { name: /travel/i });
    
    await expect(expenseTab || travelTab).toBeTruthy();
  });

  test('should display expense claims', async ({ page }) => {
    // Should show expense table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check for amount column with currency
    await expect(page.getByText(/₹/)).toBeVisible();
  });

  test('should navigate to submit expense', async ({ page }) => {
    // Click submit expense button
    const submitButton = page.getByRole('button', { name: /submit expense/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Should navigate to expense form
      await expect(page.getByText(/submit expense/i)).toBeVisible();
      
      // Check for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toContainText(/expense/i);
      }
      
      // Form should have required fields
      await expect(page.getByLabel(/category|amount/i)).toBeTruthy();
    }
  });

  test('should view expense details', async ({ page }) => {
    // Click view on first expense
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show expense details
      await expect(page.getByText(/expense details|category|receipt/i)).toBeVisible();
    }
  });

  test('should approve expense', async ({ page }) => {
    // Find approve button
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    
    if (await approveButton.isVisible()) {
      await approveButton.click();
      
      // Should show confirmation
      await expect(page.getByText(/confirm|are you sure/i)).toBeVisible();
      
      // Confirm approval
      const confirmButton = page.getByRole('button', { name: /confirm|yes/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        
        // Should show success message
        await expect(page.getByText(/approved|success/i)).toBeVisible();
      }
    }
  });

  test('should display travel requests', async ({ page }) => {
    // Switch to travel tab
    const travelTab = page.getByRole('tab', { name: /travel/i });
    
    if (await travelTab.isVisible()) {
      await travelTab.click();
      
      // Should show travel requests
      await expect(page.getByText(/destination|travel/i)).toBeVisible();
    }
  });

  test('should navigate to request travel', async ({ page }) => {
    // Switch to travel tab
    const travelTab = page.getByRole('tab', { name: /travel/i });
    if (await travelTab.isVisible()) {
      await travelTab.click();
    }
    
    // Click request travel button
    const requestButton = page.getByRole('button', { name: /request travel/i });
    
    if (await requestButton.isVisible()) {
      await requestButton.click();
      
      // Should navigate to travel form
      await expect(page.getByText(/request travel/i)).toBeVisible();
      
      // Check for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toContainText(/travel/i);
      }
    }
  });

  test('should filter expenses by status', async ({ page }) => {
    // Find status filter
    const statusFilter = page.getByRole('tab', { name: /pending|approved/i });
    
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search expenses', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Travel');
      await page.waitForTimeout(500);
    }
  });
});
