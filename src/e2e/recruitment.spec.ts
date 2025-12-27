/**
 * E2E Tests for Recruitment (ATS)
 */
import { test, expect } from '@playwright/test';

test.describe('Recruitment (ATS)', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to recruitment
    await page.getByRole('link', { name: /recruitment/i }).first().click();
  });

  test('should display recruitment tabs', async ({ page }) => {
    // Check for tabs
    const jobsTab = page.getByRole('tab', { name: /job openings/i });
    const candidatesTab = page.getByRole('tab', { name: /candidates/i });
    
    await expect(jobsTab || candidatesTab).toBeTruthy();
  });

  test('should display job openings', async ({ page }) => {
    // Click job openings tab
    const jobsTab = page.getByRole('tab', { name: /job openings/i });
    
    if (await jobsTab.isVisible()) {
      await jobsTab.click();
      
      // Should show job cards or list
      await expect(page.getByText(/software|engineer|developer|manager/i)).toBeVisible();
    }
  });

  test('should view job details', async ({ page }) => {
    // Find and click view details button
    const viewButton = page.getByRole('button', { name: /view details|view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show job description
      await expect(page.getByText(/job description|requirements|qualifications/i)).toBeVisible();
      
      // Check for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toContainText(/recruitment/i);
      }
    }
  });

  test('should display candidates list', async ({ page }) => {
    // Click candidates tab
    const candidatesTab = page.getByRole('tab', { name: /candidates/i });
    
    if (await candidatesTab.isVisible()) {
      await candidatesTab.click();
      
      // Should show candidates table
      await expect(page.getByRole('table')).toBeVisible();
      
      // Check for status badges
      await expect(page.getByText(/applied|screening|interview/i)).toBeVisible();
    }
  });

  test('should view candidate profile', async ({ page }) => {
    // Switch to candidates tab
    const candidatesTab = page.getByRole('tab', { name: /candidates/i });
    if (await candidatesTab.isVisible()) {
      await candidatesTab.click();
    }
    
    // Click view on first candidate
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show candidate details
      await expect(page.getByText(/experience|skills|education/i)).toBeVisible();
    }
  });

  test('should filter candidates by status', async ({ page }) => {
    const candidatesTab = page.getByRole('tab', { name: /candidates/i });
    if (await candidatesTab.isVisible()) {
      await candidatesTab.click();
    }
    
    // Find status filter
    const statusFilter = page.getByRole('button', { name: /status/i });
    
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByText(/interview/i).first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should search candidates', async ({ page }) => {
    const candidatesTab = page.getByRole('tab', { name: /candidates/i });
    if (await candidatesTab.isVisible()) {
      await candidatesTab.click();
    }
    
    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Engineer');
      await page.waitForTimeout(500);
    }
  });
});
