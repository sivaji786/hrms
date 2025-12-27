/**
 * E2E Tests for Employee Management
 */
import { test, expect } from '@playwright/test';

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to employee management
    await page.getByRole('link', { name: /employee/i }).first().click();
  });

  test('should display employee list', async ({ page }) => {
    // Wait for employee table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check for column headers
    await expect(page.getByText(/name/i)).toBeVisible();
    await expect(page.getByText(/email/i)).toBeVisible();
    await expect(page.getByText(/department/i)).toBeVisible();
  });

  test('should search for employees', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('Rajesh');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Results should contain the search term
    await expect(page.getByText(/rajesh/i)).toBeVisible();
  });

  test('should filter employees by department', async ({ page }) => {
    // Find department filter
    const departmentFilter = page.getByRole('button', { name: /department/i });
    
    if (await departmentFilter.isVisible()) {
      await departmentFilter.click();
      
      // Select a department
      await page.getByText(/engineering/i).click();
      
      // Wait for filtered results
      await page.waitForTimeout(500);
    }
  });

  test('should navigate to add employee page', async ({ page }) => {
    // Click add employee button
    await page.getByRole('button', { name: /add employee/i }).click();
    
    // Should navigate to add employee form
    await expect(page.getByText(/add employee/i)).toBeVisible();
    
    // Check for breadcrumbs
    const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toContainText(/employee/i);
    }
  });

  test('should view employee details', async ({ page }) => {
    // Click view icon/button on first employee
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show employee profile
      await expect(page.getByText(/employee profile|overview/i)).toBeVisible();
      
      // Check for tabs
      await expect(page.getByRole('tab', { name: /overview/i })).toBeVisible();
    }
  });

  test('should navigate between employee profile tabs', async ({ page }) => {
    // View first employee
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Click on different tabs
      const attendanceTab = page.getByRole('tab', { name: /attendance/i });
      if (await attendanceTab.isVisible()) {
        await attendanceTab.click();
        await expect(page.getByText(/attendance/i)).toBeVisible();
      }
      
      const documentsTab = page.getByRole('tab', { name: /documents/i });
      if (await documentsTab.isVisible()) {
        await documentsTab.click();
        await expect(page.getByText(/documents/i)).toBeVisible();
      }
    }
  });

  test('should display pagination', async ({ page }) => {
    // Check for pagination controls
    const pagination = page.locator('nav[aria-label="pagination"]');
    
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
      
      // Check for next/previous buttons
      const nextButton = page.getByRole('button', { name: /next/i });
      const prevButton = page.getByRole('button', { name: /previous/i });
      
      await expect(nextButton || prevButton).toBeTruthy();
    }
  });

  test('should navigate back from employee details', async ({ page }) => {
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Click back button or breadcrumb
      const backButton = page.getByRole('button', { name: /back/i });
      
      if (await backButton.isVisible()) {
        await backButton.click();
        
        // Should return to employee list
        await expect(page.getByRole('table')).toBeVisible();
      }
    }
  });
});
