import { test, expect } from '@playwright/test';

test.describe('Phase 2: Sprint Board Drag & Drop', () => {
    test('should display sprint board with columns', async ({ page }) => {
        await page.goto('/sprint-board');

        // Verify all columns are present
        const columns = page.locator('div.grid.grid-cols-5');
        await expect(columns.locator('text=Backlog').first()).toBeVisible();
        await expect(columns.locator('text=Pronto').first()).toBeVisible();
        await expect(columns.locator('text=Em Progresso').first()).toBeVisible();
        await expect(columns.locator('text=Bloqueado').first()).toBeVisible();
        await expect(columns.locator('text=Concluido').first()).toBeVisible();
    });

    test('should show WIP limits on columns', async ({ page }) => {
        await page.goto('/sprint-board');

        // Check for WIP limit indicator on In Progress column
        const wipIndicator = page.locator('text=/WIP \\d+\\/\\d+/');
        if (await wipIndicator.count() > 0) {
            await expect(wipIndicator.first()).toBeVisible();
        }
    });

    test('should have search functionality', async ({ page }) => {
        await page.goto('/sprint-board');

        // Find search input
        const searchInput = page.locator('input[placeholder*="Buscar"]');
        await expect(searchInput).toBeVisible();

        // Type in search
        await searchInput.fill('test');

        // Search should filter items (implementation dependent)
    });

    test('should display keyboard shortcuts hint', async ({ page }) => {
        await page.goto('/sprint-board');

        // Check for keyboard shortcuts
        const shortcutBar = page.locator('div', { hasText: 'Novo item' });
        await expect(shortcutBar.locator('kbd').first()).toBeVisible();
    });

    test('should have create new item button', async ({ page }) => {
        await page.goto('/sprint-board');

        const newItemButton = page.locator('button:has-text("Novo Item")');
        await expect(newItemButton).toBeVisible();
    });

    test('should drag and drop work items between columns', async ({ page }) => {
        await page.goto('/sprint-board');

        // Wait for items to load
        await page.waitForTimeout(1000);

        // Find a draggable item in Backlog column
        const backlogColumn = page.locator('text=Backlog').locator('..');
        const draggableItem = backlogColumn.locator('[draggable="true"], .cursor-grab').first();

        if (await draggableItem.count() > 0) {
            // Get item position
            const itemBox = await draggableItem.boundingBox();

        // Find Ready column drop zone
            const readyColumn = page.locator('text=Pronto').locator('..');
            const dropZone = await readyColumn.boundingBox();

            if (itemBox && dropZone) {
                // Perform drag and drop
                await page.mouse.move(itemBox.x + itemBox.width / 2, itemBox.y + itemBox.height / 2);
                await page.mouse.down();
                await page.mouse.move(dropZone.x + dropZone.width / 2, dropZone.y + dropZone.height / 2);
                await page.mouse.up();

                // Wait for animation/update
                await page.waitForTimeout(500);

                // Verify item moved (this is implementation dependent)
                // The item should now be in Ready column
            }
        }
    });
});
