import { test, expect } from '@playwright/test';

test.describe('Phase 3b - Multi-Tenancy & User Assignment', () => {
    test('should display user selector in work item dialog', async ({ page }) => {
        await page.goto('/sprint-board');
        await page.click('button:has-text("Novo Item")');

        const assigneeLabel = page.getByLabel('Responsável');
        await expect(assigneeLabel).toBeVisible();

        const assigneeSelect = page.locator('button#assignee_id');
        await expect(assigneeSelect).toBeVisible();

        await assigneeSelect.click();
        await expect(page.getByRole('option', { name: 'Test User' })).toBeVisible();
    });

    test('should create work item with assignee', async ({ page }) => {
        await page.goto('/sprint-board');
        await page.click('button:has-text("Novo Item")');

        await page.fill('input#title', 'Task with Assignee');
        await page.click('button#assignee_id');
        await page.getByRole('option', { name: 'Test User' }).click();
        await page.click('button:has-text("Criar")');

        const heading = page.getByRole('heading', { name: 'Task with Assignee' }).first();
        await expect(heading).toBeVisible({ timeout: 10000 });
        const cardContent = heading.locator('xpath=ancestor::div[@data-slot="card-content"]');
        await expect(cardContent.locator('div[title="Test User"]')).toBeVisible();
    });

    test('should filter sprints by organization', async ({ page }) => {
        await page.goto('/sprint-planning');
        await expect(page.getByRole('heading', { name: /Planejamento/ })).toBeVisible();
        await page.waitForSelector('text=Sprint 1', { timeout: 10000 });
        await expect(page.locator('text=Sprint 1')).toBeVisible();
    });
});
