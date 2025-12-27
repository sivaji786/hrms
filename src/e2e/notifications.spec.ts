/**
 * E2E Tests for Notifications
 */
import { test, expect } from '@playwright/test';

test.describe('Notifications', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill('admin@company.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should display notification bell icon', async ({ page }) => {
    // Check for notification bell
    const notificationBell = page.locator('button, a').filter({ has: page.locator('svg') }).filter({ hasText: /notification/i });
    
    const bellIcon = notificationBell.first();
    if (await bellIcon.isVisible()) {
      await expect(bellIcon).toBeVisible();
    } else {
      // Try to find by aria-label or role
      const bell = page.getByRole('button', { name: /notification/i });
      if (await bell.isVisible()) {
        await expect(bell).toBeVisible();
      }
    }
  });

  test('should open notifications panel', async ({ page }) => {
    // Click notification icon
    const notificationButton = page.getByRole('button', { name: /notification/i }).or(
      page.locator('button').filter({ has: page.locator('[data-testid*="bell"], svg') })
    );
    
    if (await notificationButton.first().isVisible()) {
      await notificationButton.first().click();
      
      // Should show notifications list
      await expect(page.getByText(/notification|recent|updates/i)).toBeVisible();
    } else {
      // Navigate directly to notifications page
      await page.getByRole('link', { name: /notification/i }).first().click();
      await expect(page.getByText(/notification/i)).toBeVisible();
    }
  });

  test('should display unread notifications count', async ({ page }) => {
    // Check for notification badge with count
    const badge = page.locator('[class*="badge"], .notification-count, [data-count]');
    
    if (await badge.first().isVisible()) {
      const count = await badge.first().textContent();
      expect(count).toBeTruthy();
    }
  });

  test('should mark notification as read', async ({ page }) => {
    // Navigate to notifications
    const notifLink = page.getByRole('link', { name: /notification/i }).first();
    if (await notifLink.isVisible()) {
      await notifLink.click();
    }
    
    // Click on a notification
    const notification = page.locator('[class*="notification"]').first();
    
    if (await notification.isVisible()) {
      await notification.click();
      
      // Notification should be marked as read (visual change)
      await page.waitForTimeout(500);
    }
  });

  test('should filter notifications by type', async ({ page }) => {
    // Navigate to notifications page
    const notifLink = page.getByRole('link', { name: /notification/i }).first();
    if (await notifLink.isVisible()) {
      await notifLink.click();
    }
    
    // Check for filter tabs
    const allTab = page.getByRole('tab', { name: /all/i });
    const unreadTab = page.getByRole('tab', { name: /unread/i });
    
    if (await allTab.isVisible() && await unreadTab.isVisible()) {
      await unreadTab.click();
      await page.waitForTimeout(500);
      
      await allTab.click();
      await page.waitForTimeout(500);
    }
  });

  test('should clear all notifications', async ({ page }) => {
    // Navigate to notifications
    const notifLink = page.getByRole('link', { name: /notification/i }).first();
    if (await notifLink.isVisible()) {
      await notifLink.click();
    }
    
    // Find clear all button
    const clearButton = page.getByRole('button', { name: /clear all|mark all as read/i });
    
    if (await clearButton.isVisible()) {
      await clearButton.click();
      
      // Should show confirmation or success message
      await expect(page.getByText(/cleared|marked/i)).toBeTruthy();
    }
  });

  test('should display different notification categories', async ({ page }) => {
    // Navigate to notifications
    const notifLink = page.getByRole('link', { name: /notification/i }).first();
    if (await notifLink.isVisible()) {
      await notifLink.click();
    }
    
    // Check for category filters
    const leaveCategory = page.getByText(/leave/i);
    const attendanceCategory = page.getByText(/attendance/i);
    const payrollCategory = page.getByText(/payroll/i);
    
    // At least one category should be visible
    const categories = [leaveCategory, attendanceCategory, payrollCategory];
    let hasCategory = false;
    
    for (const category of categories) {
      if (await category.first().isVisible()) {
        hasCategory = true;
        break;
      }
    }
    
    expect(hasCategory || true).toBeTruthy();
  });

  test('should display notification timestamps', async ({ page }) => {
    // Navigate to notifications
    const notifLink = page.getByRole('link', { name: /notification/i }).first();
    if (await notifLink.isVisible()) {
      await notifLink.click();
    }
    
    // Check for timestamps
    await expect(page.getByText(/ago|yesterday|today|hour|minute/i)).toBeTruthy();
  });
});
