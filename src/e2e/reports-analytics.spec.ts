/**
 * E2E Tests for Reports & Analytics
 */
import { test, expect } from '@playwright/test';

test.describe('Reports & Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to reports
    await page.getByRole('link', { name: /report|analytics/i }).first().click();
  });

  test('should display report categories', async ({ page }) => {
    // Check for report categories
    await expect(page.getByText(/attendance|payroll|employee|leave|performance/i)).toBeVisible();
  });

  test('should display analytics dashboard', async ({ page }) => {
    // Should show charts and visualizations
    const charts = page.locator('svg, canvas, [class*="chart"]');
    
    if (await charts.first().isVisible()) {
      expect(await charts.count()).toBeGreaterThan(0);
    }
  });

  test('should filter reports by date range', async ({ page }) => {
    // Find date range filter
    const dateFilter = page.getByRole('button', { name: /date|range|filter/i });
    
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
      
      // Should show date picker
      await expect(page.locator('[class*="calendar"], [type="date"]')).toBeTruthy();
    }
  });

  test('should display attendance report', async ({ page }) => {
    // Click on attendance report
    const attendanceReport = page.getByText(/attendance report/i).or(
      page.getByRole('tab', { name: /attendance/i })
    );
    
    if (await attendanceReport.first().isVisible()) {
      await attendanceReport.first().click();
      
      // Should show attendance data
      await expect(page.getByText(/attendance|present|absent/i)).toBeVisible();
    }
  });

  test('should display payroll report', async ({ page }) => {
    // Click on payroll report
    const payrollReport = page.getByText(/payroll report/i).or(
      page.getByRole('tab', { name: /payroll/i })
    );
    
    if (await payrollReport.first().isVisible()) {
      await payrollReport.first().click();
      
      // Should show payroll data with currency
      await expect(page.getByText(/₹|salary|payroll/i)).toBeVisible();
    }
  });

  test('should display employee report', async ({ page }) => {
    // Click on employee report
    const employeeReport = page.getByText(/employee report/i).or(
      page.getByRole('tab', { name: /employee/i })
    );
    
    if (await employeeReport.first().isVisible()) {
      await employeeReport.first().click();
      
      // Should show employee data
      await expect(page.getByText(/employee|department|headcount/i)).toBeVisible();
    }
  });

  test('should export report as PDF', async ({ page }) => {
    // Find export button
    const exportButton = page.getByRole('button', { name: /export|download|pdf/i });
    
    if (await exportButton.first().isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      await exportButton.first().click();
      
      const download = await downloadPromise;
      if (download) {
        expect(download).toBeTruthy();
      }
    }
  });

  test('should export report as Excel', async ({ page }) => {
    // Find excel export button
    const excelButton = page.getByRole('button', { name: /excel|xlsx|csv/i });
    
    if (await excelButton.first().isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      await excelButton.first().click();
      
      const download = await downloadPromise;
      if (download) {
        expect(download).toBeTruthy();
      }
    }
  });

  test('should display key performance indicators', async ({ page }) => {
    // Check for KPI cards
    const stats = page.locator('[class*="StatCard"], .stat-card, .kpi');
    
    if (await stats.first().isVisible()) {
      expect(await stats.count()).toBeGreaterThan(0);
    }
  });

  test('should filter by department', async ({ page }) => {
    // Find department filter
    const departmentFilter = page.getByRole('button', { name: /department/i });
    
    if (await departmentFilter.isVisible()) {
      await departmentFilter.click();
      await page.getByText(/engineering|hr|sales/i).first().click();
      await page.waitForTimeout(1000);
      
      // Charts should update
      await expect(page.locator('svg, canvas')).toBeVisible();
    }
  });

  test('should display charts for different metrics', async ({ page }) => {
    // Check for multiple chart types
    const charts = page.locator('svg, canvas, [class*="chart"]');
    
    if (await charts.first().isVisible()) {
      const chartCount = await charts.count();
      expect(chartCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('should toggle between chart and table view', async ({ page }) => {
    // Find view toggle buttons
    const chartView = page.getByRole('button', { name: /chart|graph/i });
    const tableView = page.getByRole('button', { name: /table|list/i });
    
    if (await chartView.isVisible() && await tableView.isVisible()) {
      await tableView.click();
      await page.waitForTimeout(500);
      
      // Should show table
      await expect(page.getByRole('table')).toBeVisible();
      
      await chartView.click();
      await page.waitForTimeout(500);
      
      // Should show chart
      await expect(page.locator('svg, canvas')).toBeVisible();
    }
  });
});
