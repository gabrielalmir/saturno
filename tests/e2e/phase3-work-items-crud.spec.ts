import { test, expect } from '@playwright/test';
import { openWorkItemDetailFromList } from './helpers';

test.describe('Phase 3: Work Items CRUD', () => {
    test('should open create work item dialog from sprint board', async ({ page }) => {
        await page.goto('/sprint-board');

        await page.click('button:has-text("Novo Item")');

        const dialogHeading = page.getByRole('heading', { name: 'Novo Work Item' });
        await expect(dialogHeading).toBeVisible();

        await expect(page.getByLabel('Título')).toBeVisible();
        await expect(page.getByLabel('Descrição')).toBeVisible();
        await expect(page.getByLabel('Tier')).toBeVisible();

        await page.click('button:has-text("Configurações avançadas")');
        await expect(page.getByLabel('Tipo')).toBeVisible();
        await expect(page.getByLabel('Tamanho')).toBeVisible();
        await expect(page.getByLabel('Prioridade')).toBeVisible();
    });

    test('should create a new work item', async ({ page }) => {
        await page.goto('/sprint-board');

        await page.click('button:has-text("Novo Item")');
        await page.fill('input#title', 'Test Work Item E2E');
        await page.fill('textarea#description', 'This is a test work item created by E2E test');

        await page.click('button:has-text("Configurações avançadas")');
        await page.fill('input#estimate', '5');

        await page.click('button:has-text("Criar")');

        await expect(page.getByRole('heading', { name: 'Novo Work Item' })).not.toBeVisible({ timeout: 5000 });
    });

    test('should open edit dialog from work item detail', async ({ page }) => {
        await openWorkItemDetailFromList(page);

        await page.click('button:has-text("Editar")');

        const editHeading = page.getByRole('heading', { name: 'Editar Work Item' });
        await expect(editHeading).toBeVisible();
    });

    test('should edit an existing work item', async ({ page }) => {
        await openWorkItemDetailFromList(page);

        await page.click('button:has-text("Editar")');

        const titleInput = page.locator('input#title');
        const originalTitle = await titleInput.inputValue();
        await titleInput.fill(originalTitle + ' (Edited)');

        await page.click('button:has-text("Atualizar")');

        await expect(page.getByRole('heading', { name: `${originalTitle} (Edited)` })).toBeVisible({ timeout: 5000 });
    });

    test('should show delete confirmation dialog', async ({ page }) => {
        await openWorkItemDetailFromList(page);

        await page.click('button:has-text("Excluir")');

        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'Excluir Work Item?' })).toBeVisible();
        await expect(dialog.getByText(/tem certeza/i)).toBeVisible();

        await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeVisible();
        await expect(dialog.getByRole('button', { name: 'Excluir' })).toBeVisible();

        await dialog.getByRole('button', { name: 'Cancelar' }).click();
        await expect(dialog.getByRole('heading', { name: 'Excluir Work Item?' })).not.toBeVisible({ timeout: 5000 });
    });

    test('should validate required fields', async ({ page }) => {
        await page.goto('/sprint-board');

        await page.click('button:has-text("Novo Item")');
        await page.click('button:has-text("Criar")');

        await expect(page.getByRole('heading', { name: 'Novo Work Item' })).toBeVisible();

        const titleInput = page.locator('input#title');
        const isInvalid = await titleInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
        expect(isInvalid).toBe(true);
    });

    test('should close dialog on cancel', async ({ page }) => {
        await page.goto('/sprint-board');

        await page.click('button:has-text("Novo Item")');
        await page.click('button:has-text("Cancelar")');

        await expect(page.getByRole('heading', { name: 'Novo Work Item' })).not.toBeVisible({ timeout: 5000 });
    });
});
