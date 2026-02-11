import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
    const project = config.projects[0];
    const baseURL = project?.use?.baseURL as string | undefined;
    if (!baseURL) throw new Error('Missing baseURL in Playwright config.');

    const authDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.auth');
    const statePath = path.resolve(authDir, 'state.json');
    fs.mkdirSync(authDir, { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({ baseURL });

    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 30_000 });

    await page.context().storageState({ path: statePath });
    await browser.close();
}
