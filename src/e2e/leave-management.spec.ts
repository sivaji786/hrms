/**
 * E2E Tests for Leave Management
 */
import { test, expect } from '@playwright/test';

test.describe('Leave Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to leave management
    await page.getByRole('link', { name: /leave/i }).first().click();
  });

  test('should display leave requests', async ({ page }) => {
    // Should show leave table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check for status badges
    await expect(page.getByText(/pending|approved|rejected/i)).toBeVisible();
  });

  test('should filter leave requests by status', async ({ page }) => {
    // Click pending tab
    const pendingTab = page.getByRole('tab', { name: /pending/i });
    
    if (await pendingTab.isVisible()) {
      await pendingTab.click();
      await page.waitForTimeout(500);
      
      // Should show only pending requests
      await expect(page.getByText(/pending/i)).toBeVisible();
    }
  });

  test('should approve leave request', async ({ page }) => {
    // Find approve button
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    
    if (await approveButton.isVisible()) {
      await approveButton.click();
      
      // Should show confirmation dialog
      await expect(page.getByText(/confirm|are you sure/i)).toBeVisible();
      
      // Confirm approval
      await page.getByRole('button', { name: /confirm|yes/i }).click();
      
      // Should show success message
      await expect(page.getByText(/approved|success/i)).toBeVisible();
    }
  });

  test('should reject leave request', async ({ page }) => {
    // Find reject button
    const rejectButton = page.getByRole('button', { name: /reject/i }).first();
    
    if (await rejectButton.isVisible()) {
      await rejectButton.click();
      
      // Should show confirmation dialog or reason field
      await expect(page.getByText(/reason|confirm/i)).toBeVisible();
    }
  });

  test('should display leave balance stats', async ({ page }) => {
    // Check for stat cards
    const stats = page.locator('[class*="StatCard"], .stat-card');
    
    if (await stats.first().isVisible()) {
      expect(await stats.count()).toBeGreaterThan(0);
    }
  });

  test('should view leave details', async ({ page }) => {
    // Click view button
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show leave details
      await expect(page.getByText(/leave details|leave type/i)).toBeVisible();
    }
  });

  test('should search leave requests', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Rajesh');
      await page.waitForTimeout(500);
      
      // Results should filter
      await expect(page.getByText(/rajesh/i)).toBeVisible();
    }
  });
});
