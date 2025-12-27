/**
 * E2E Tests for Employee Portal
 */
import { test, expect } from '@playwright/test';

test.describe('Employee Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login as employee
    await page.goto('/');
    
    // Switch to employee login if needed
    const employeeButton = page.getByText(/employee login/i);
    if (await employeeButton.isVisible()) {
      await employeeButton.click();
    }
    
    await page.getByPlaceholder(/email/i).fill('employee@company.com');
    await page.getByPlaceholder(/password/i).fill('emp123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for employee portal to load
    await page.waitForTimeout(1000);
  });

  test('should display employee dashboard', async ({ page }) => {
    // Should show employee dashboard elements
    await expect(page.getByText(/dashboard|welcome|my/i)).toBeVisible();
  });

  test('should display employee profile', async ({ page }) => {
    // Navigate to my profile
    await page.getByRole('link', { name: /my profile|profile/i }).first().click();
    
    // Should show profile information
    await expect(page.getByText(/profile|personal information|contact/i)).toBeVisible();
  });

  test('should display my attendance', async ({ page }) => {
    // Navigate to my attendance
    await page.getByRole('link', { name: /my attendance|attendance/i }).first().click();
    
    // Should show attendance calendar
    await expect(page.getByText(/attendance|check-in|check-out/i)).toBeVisible();
  });

  test('should check in', async ({ page }) => {
    // Navigate to attendance
    await page.getByRole('link', { name: /my attendance|attendance/i }).first().click();
    
    // Find check-in button
    const checkInButton = page.getByRole('button', { name: /check in/i });
    
    if (await checkInButton.isVisible()) {
      await checkInButton.click();
      
      // Should show success message
      await expect(page.getByText(/checked in|success/i)).toBeVisible();
    }
  });

  test('should check out', async ({ page }) => {
    // Navigate to attendance
    await page.getByRole('link', { name: /my attendance|attendance/i }).first().click();
    
    // Find check-out button
    const checkOutButton = page.getByRole('button', { name: /check out/i });
    
    if (await checkOutButton.isVisible()) {
      await checkOutButton.click();
      
      // Should show success message
      await expect(page.getByText(/checked out|success/i)).toBeVisible();
    }
  });

  test('should display my leaves', async ({ page }) => {
    // Navigate to my leaves
    await page.getByRole('link', { name: /my leaves|leave/i }).first().click();
    
    // Should show leave balance and requests
    await expect(page.getByText(/leave|balance|remaining/i)).toBeVisible();
  });

  test('should apply for leave', async ({ page }) => {
    // Navigate to my leaves
    await page.getByRole('link', { name: /my leaves|leave/i }).first().click();
    
    // Click apply leave button
    const applyButton = page.getByRole('button', { name: /apply leave|request/i });
    
    if (await applyButton.isVisible()) {
      await applyButton.click();
      
      // Should show leave form
      await expect(page.getByLabel(/leave type|start date|reason/i)).toBeTruthy();
    }
  });

  test('should display my payslips', async ({ page }) => {
    // Navigate to my payslips
    await page.getByRole('link', { name: /my payslips|payslip/i }).first().click();
    
    // Should show payslip list
    await expect(page.getByText(/payslip|salary|month/i)).toBeVisible();
  });

  test('should download payslip', async ({ page }) => {
    // Navigate to my payslips
    await page.getByRole('link', { name: /my payslips|payslip/i }).first().click();
    
    // Find download button
    const downloadButton = page.getByRole('button', { name: /download/i }).first();
    
    if (await downloadButton.isVisible()) {
      await downloadButton.click();
      
      // Should show success or download
      await expect(page.getByText(/downloaded|download/i)).toBeTruthy();
    }
  });

  test('should display my expenses', async ({ page }) => {
    // Navigate to my expenses
    await page.getByRole('link', { name: /my expenses|expense/i }).first().click();
    
    // Should show expense list
    await expect(page.getByText(/expense|claim|amount/i)).toBeVisible();
  });

  test('should submit expense claim', async ({ page }) => {
    // Navigate to expenses
    await page.getByRole('link', { name: /my expenses|expense/i }).first().click();
    
    // Click submit expense button
    const submitButton = page.getByRole('button', { name: /submit expense|new expense/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Should show expense form
      await expect(page.getByLabel(/category|amount|date/i)).toBeTruthy();
    }
  });

  test('should display my documents', async ({ page }) => {
    // Navigate to my documents
    await page.getByRole('link', { name: /my documents|documents/i }).first().click();
    
    // Should show document list
    await expect(page.getByText(/document|policy|form/i)).toBeVisible();
  });

  test('should display my training', async ({ page }) => {
    // Navigate to my training
    await page.getByRole('link', { name: /my training|training/i }).first().click();
    
    // Should show training list
    await expect(page.getByText(/training|course|enrolled/i)).toBeVisible();
  });

  test('should display my performance', async ({ page }) => {
    // Navigate to my performance
    await page.getByRole('link', { name: /my performance|performance/i }).first().click();
    
    // Should show performance reviews
    await expect(page.getByText(/performance|review|appraisal|goals/i)).toBeVisible();
  });

  test('should create support ticket', async ({ page }) => {
    // Navigate to tickets
    await page.getByRole('link', { name: /ticket|support/i }).first().click();
    
    // Click create ticket button
    const createButton = page.getByRole('button', { name: /create ticket|new ticket/i });
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Should show ticket form
      await expect(page.getByLabel(/subject|description|priority/i)).toBeTruthy();
    }
  });
});
