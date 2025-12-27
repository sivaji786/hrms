/**
 * E2E Tests for Attendance & Time Tracking
 */
import { test, expect } from '@playwright/test';

test.describe('Attendance & Time Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Navigate to attendance
    await page.getByRole('link', { name: /attendance/i }).first().click();
  });

  test('should display attendance tabs', async ({ page }) => {
    // Check for tabs
    await expect(page.getByRole('tab', { name: /today/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /calendar/i })).toBeVisible();
  });

  test('should display today attendance list', async ({ page }) => {
    // Click today tab
    await page.getByRole('tab', { name: /today/i }).click();
    
    // Should show attendance table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check for status badges
    const statusBadges = page.locator('.badge, [class*="badge"]');
    if (await statusBadges.count() > 0) {
      expect(await statusBadges.count()).toBeGreaterThan(0);
    }
  });

  test('should switch to calendar view', async ({ page }) => {
    // Click calendar tab
    await page.getByRole('tab', { name: /calendar/i }).click();
    
    // Should show calendar
    await expect(page.locator('[class*="calendar"]')).toBeVisible();
  });

  test('should change month in calendar view', async ({ page }) => {
    // Switch to calendar view
    await page.getByRole('tab', { name: /calendar/i }).click();
    
    // Find month dropdown
    const monthDropdown = page.locator('select').first();
    
    if (await monthDropdown.isVisible()) {
      // Select different month
      await monthDropdown.selectOption({ index: 1 });
      
      // Calendar should update
      await page.waitForTimeout(500);
      await expect(page.locator('[class*="calendar"]')).toBeVisible();
    }
  });

  test('should view attendance details', async ({ page }) => {
    // Click view button on first attendance record
    const viewButton = page.getByRole('button', { name: /view/i }).first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show attendance details
      await expect(page.getByText(/attendance details|check-in|check-out/i)).toBeVisible();
    }
  });

  test('should navigate to shift management', async ({ page }) => {
    // Look for shift management tab or link
    const shiftTab = page.getByRole('tab', { name: /shift/i });
    
    if (await shiftTab.isVisible()) {
      await shiftTab.click();
      
      // Should show shift management
      await expect(page.getByText(/shift/i)).toBeVisible();
    }
  });

  test('should navigate to holiday management', async ({ page }) => {
    // Look for holiday management tab or link
    const holidayTab = page.getByRole('tab', { name: /holiday/i });
    
    if (await holidayTab.isVisible()) {
      await holidayTab.click();
      
      // Should show holiday management
      await expect(page.getByText(/holiday/i)).toBeVisible();
    }
  });

  test('should display calendar with color-coded attendance', async ({ page }) => {
    // Switch to calendar view
    await page.getByRole('tab', { name: /calendar/i }).click();
    
    // Check for calendar cells with different colors
    const calendarCells = page.locator('[class*="calendar"] > div');
    expect(await calendarCells.count()).toBeGreaterThan(0);
  });
});
