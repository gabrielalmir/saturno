import { test, expect } from '@playwright/test';
import { openWorkItemDetailFromList } from './helpers';

test.describe('Phase 1: Critical Fixes', () => {
    test('should display Saturno logo and branding', async ({ page }) => {
        await page.goto('/dashboard');

        // Check for Saturno branding
        await expect(page.locator('text=Saturno')).toBeVisible();

        // Verify logo is present (SVG with planet and rings)
        const logo = page.locator('svg').first();
        await expect(logo).toBeVisible();
    });

    test('should load work item detail page without 404', async ({ page }) => {
        await openWorkItemDetailFromList(page);

        // Should not show 404
        await expect(page.locator('text=/not found/i')).not.toBeVisible();

        // Should show work item details
        await expect(page.locator('button:has-text("Editar")')).toBeVisible();
        await expect(page.locator('button:has-text("Excluir")')).toBeVisible();
    });

    test('should display all status badges correctly', async ({ page }) => {
        await page.goto('/sprint-board');

        // Check that status columns are visible
        await page.waitForSelector('div.grid.grid-cols-5');
        const columns = page.locator('div.grid.grid-cols-5 > div');
        await expect(columns.nth(0).locator('text=Backlog')).toBeVisible();
        await expect(columns.nth(1).locator('text=Pronto')).toBeVisible();
        await expect(columns.nth(2).locator('text=Em Progresso')).toBeVisible();
        await expect(columns.nth(3).locator('text=Bloqueado')).toBeVisible();
        await expect(columns.nth(4).locator('text=Concluido')).toBeVisible();
    });
});
