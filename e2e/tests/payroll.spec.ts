import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Payroll Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/payroll');
  });

  test('should display payroll dashboard with default data', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toContainText('Payroll Dashboard');

    // Check navigation tabs
    await expect(page.locator('button:has-text("Evidence")')).toBeVisible();
    await expect(page.locator('button:has-text("Summary")')).toBeVisible();

    // Check import button
    await expect(page.locator('button:has-text("Import Shift Data")')).toBeVisible();

    // Check that evidence tab is active by default
    await expect(page.locator('button:has-text("Evidence")')).toBeDisabled();

    // Check work entry table is visible
    await expect(page.locator('h3:has-text("Work Entries")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    // Check that mock data is displayed
    await expect(page.locator('text=Jan Novák')).toBeVisible();
    await expect(page.locator('text=Marie Svobodová')).toBeVisible();
  });

  test('should switch between Evidence and Summary tabs', async ({ page }) => {
    // Initially on Evidence tab
    await expect(page.locator('h3:has-text("Work Entries")')).toBeVisible();

    // Switch to Summary tab
    await page.click('button:has-text("Summary")');
    
    // Check Summary tab is now active
    await expect(page.locator('button:has-text("Summary")')).toBeDisabled();
    await expect(page.locator('button:has-text("Evidence")')).not.toBeDisabled();

    // Check summary content is displayed
    await expect(page.locator('h3:has-text("Summary")')).toBeVisible();
    await expect(page.locator('h4:has-text("Total Hours")')).toBeVisible();
    await expect(page.locator('h4:has-text("Total Tips")')).toBeVisible();
    await expect(page.locator('h4:has-text("Total Bonus")')).toBeVisible();
    await expect(page.locator('h4:has-text("Total Cost")')).toBeVisible();

    // Check chart section
    await expect(page.locator('h3:has-text("Cost per Employee")')).toBeVisible();
    await expect(page.locator('h4:has-text("Employee Details")')).toBeVisible();

    // Switch back to Evidence tab
    await page.click('button:has-text("Evidence")');
    await expect(page.locator('h3:has-text("Work Entries")')).toBeVisible();
  });

  test('should open and close import dialog', async ({ page }) => {
    // Open import dialog
    await page.click('button:has-text("Import Shift Data")');

    // Check dialog is open
    await expect(page.locator('dialog[open]')).toBeVisible();
    await expect(page.locator('h2:has-text("Import Shift Data")')).toBeVisible();
    await expect(page.locator('text=Drag and drop a shift file here')).toBeVisible();
    await expect(page.locator('text=Supported formats: .xlsx, .xls, .csv')).toBeVisible();

    // Close dialog
    await page.click('button:has-text("✕")');
    
    // Check dialog is closed
    await expect(page.locator('dialog[open]')).not.toBeVisible();
  });

  test('should upload and import CSV file', async ({ page }) => {
    // Create a test CSV file content
    const csvContent = `date,employee,hours,tips,bonus
2025-01-17,Test Employee,8,200,100
2025-01-18,Test Employee 2,6,150,50`;

    // Open import dialog
    await page.click('button:has-text("Import Shift Data")');

    // Upload file using file input
    const fileInput = page.locator('input[type="file"]');
    
    // Create a temporary file for testing
    await fileInput.setInputFiles({
      name: 'test-shifts.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(csvContent)
    });

    // Wait for file processing
    await page.waitForTimeout(1000);

    // Check preview is displayed
    await expect(page.locator('h3:has-text("Import Preview")')).toBeVisible();
    await expect(page.locator('text=Test Employee')).toBeVisible();
    await expect(page.locator('text=Test Employee 2')).toBeVisible();

    // Check data preview table
    await expect(page.locator('h4:has-text("Data Preview")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    // Import the data
    await page.click('button:has-text("Import 2 Entries")');

    // Check success message
    await expect(page.locator('text=✓ Shift sheet imported: 2 entries added')).toBeVisible();

    // Check dialog is closed
    await expect(page.locator('dialog[open]')).not.toBeVisible();

    // Verify new entries are in the table
    await expect(page.locator('text=Test Employee')).toBeVisible();
    await expect(page.locator('text=Test Employee 2')).toBeVisible();
  });

  test('should edit work entries inline', async ({ page }) => {
    // Find first editable cell (employee name)
    const firstEmployeeCell = page.locator('table tbody tr').first().locator('td').nth(1).locator('span');
    
    // Click to edit
    await firstEmployeeCell.click();

    // Check input field appears
    const input = page.locator('table tbody tr').first().locator('td').nth(1).locator('input');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    // Change the value
    await input.fill('Edited Employee Name');
    
    // Press Enter to save
    await input.press('Enter');

    // Check the value was updated
    await expect(page.locator('text=Edited Employee Name')).toBeVisible();
  });

  test('should filter work entries by employee name', async ({ page }) => {
    // Use the filter input
    const filterInput = page.locator('input[placeholder="Filter by employee name..."]');
    await filterInput.fill('Jan');

    // Check only Jan Novák entries are visible
    await expect(page.locator('text=Jan Novák')).toBeVisible();
    await expect(page.locator('text=Marie Svobodová')).not.toBeVisible();

    // Clear filter
    await filterInput.fill('');

    // Check all entries are visible again
    await expect(page.locator('text=Jan Novák')).toBeVisible();
    await expect(page.locator('text=Marie Svobodová')).toBeVisible();
  });

  test('should sort work entries by clicking column headers', async ({ page }) => {
    // Click on Date column header to sort
    await page.click('th:has-text("Date")');

    // Check sort indicator appears
    await expect(page.locator('th:has-text("Date") div')).toContainText('↑');

    // Click again to reverse sort
    await page.click('th:has-text("Date")');
    await expect(page.locator('th:has-text("Date") div')).toContainText('↓');
  });

  test('should display correct summary calculations', async ({ page }) => {
    // Switch to Summary tab
    await page.click('button:has-text("Summary")');

    // Check summary cards display correct totals
    // Based on mock data: Jan (8+7.5=15.5h, 150+180=330tips, 200+150=350bonus) + Marie (6h, 120tips, 100bonus)
    // Total: 21.5h, 450tips, 450bonus, 900cost
    const totalHoursCard = page.locator('article:has(h4:has-text("Total Hours"))');
    await expect(totalHoursCard.locator('span').first()).toContainText('21.5');

    const totalTipsCard = page.locator('article:has(h4:has-text("Total Tips"))');
    await expect(totalTipsCard.locator('span').first()).toContainText('450');

    const totalBonusCard = page.locator('article:has(h4:has-text("Total Bonus"))');
    await expect(totalBonusCard.locator('span').first()).toContainText('450');

    const totalCostCard = page.locator('article:has(h4:has-text("Total Cost"))');
    await expect(totalCostCard.locator('span').first()).toContainText('900');
  });

  test('should save data with Ctrl+S shortcut', async ({ page }) => {
    // Focus on the work entry table
    await page.locator('table').click();

    // Press Ctrl+S
    await page.keyboard.press('Control+s');

    // Check alert appears
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Data saved!');
      await dialog.accept();
    });
  });
}); 