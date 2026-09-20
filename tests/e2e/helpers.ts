import type { Page } from '@playwright/test';

export async function login(page: Page, email = 'test@example.com', password = 'password') {
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 30000 });
}

export async function openWorkItemDetailFromList(page: Page) {
    await page.goto('/work-items');
    // The list always renders "Ver detalhes" links per card.
    await page.click('a:has-text("Ver detalhes")');
    await page.waitForURL(/\/work-items\/\d+/, { timeout: 10000 });
}

export async function createWorkItem(page: Page, data: {
    title: string;
    description?: string;
    tier?: 'N1' | 'N2';
    type?: string;
    size?: string;
    priority?: string;
    estimate?: number;
}) {
    // Open create dialog
    await page.click('button:has-text("Novo Item")');

    // Fill form
    await page.fill('input#title', data.title);

    if (data.description) {
        await page.fill('textarea#description', data.description);
    }

    if (data.tier) {
        await page.click('button#tier');
        await page.click(`text=${data.tier} -`);
    }

    // Advanced settings contain type/estimate (and some other fields).
    if (data.type || data.estimate) {
        await page.click('button:has-text("Configurações avançadas")');
    }

    if (data.type) {
        await page.click('button#type');
        await page.click(`text=${data.type}`);
    }

    if (data.size) {
        await page.click('button#size');
        await page.click(`text=${data.size}`);
    }

    if (data.priority) {
        await page.click('button#priority');
        await page.click(`text=${data.priority}`);
    }

    if (data.estimate) {
        await page.fill('input#estimate', data.estimate.toString());
    }

    // Submit
    await page.click('button:has-text("Criar")');

    // Wait for dialog to close
    await page.waitForSelector('text=Novo Work Item', { state: 'hidden', timeout: 5000 });
}
