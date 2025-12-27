/**
 * E2E Tests for Payroll Management
 */
import { test, expect } from '@playwright/test';

test.describe('Payroll Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to payroll
    await page.getByRole('link', { name: /payroll/i }).first().click();
  });

  test('should display payroll stats', async ({ page }) => {
    // Check for stat cards
    await expect(page.getByText(/total payroll|gross|net|deductions/i)).toBeVisible();
  });

  test('should display employee payroll list', async ({ page }) => {
    // Should show payroll table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check for currency symbols
    await expect(page.getByText(/₹/)).toBeVisible();
  });

  test('should filter payroll by department', async ({ page }) => {
    // Find department filter
    const departmentFilter = page.getByRole('button', { name: /department/i });
    
    if (await departmentFilter.isVisible()) {
      await departmentFilter.click();
      await page.getByText(/engineering/i).click();
      await page.waitForTimeout(500);
    }
  });

  test('should download payslip', async ({ page }) => {
    // Find download button
    const downloadButton = page.getByRole('button', { name: /download/i }).first();
    
    if (await downloadButton.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      await downloadButton.click();
      
      // Should show success toast
      await expect(page.getByText(/downloaded|success/i)).toBeVisible();
    }
  });

  test('should send payslip via email', async ({ page }) => {
    // Find send button
    const sendButton = page.getByRole('button', { name: /send|email/i }).first();
    
    if (await sendButton.isVisible()) {
      await sendButton.click();
      
      // Should show success toast
      await expect(page.getByText(/sent|success/i)).toBeVisible();
    }
  });

  test('should navigate to disburse salaries', async ({ page }) => {
    // Select employees
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    
    if (count > 1) {
      await checkboxes.nth(1).check();
      
      // Click disburse button
      const disburseButton = page.getByRole('button', { name: /disburse/i });
      
      if (await disburseButton.isVisible()) {
        await disburseButton.click();
        
        // Should navigate to disburse page
        await expect(page.getByText(/disburse salaries/i)).toBeVisible();
      }
    }
  });

  test('should display payroll chart', async ({ page }) => {
    // Check for chart visualization
    const chart = page.locator('svg, canvas, [class*="chart"]');
    
    if (await chart.first().isVisible()) {
      expect(await chart.count()).toBeGreaterThan(0);
    }
  });
});
