import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    globalSetup: './tests/e2e/global-setup.ts',
    use: {
        baseURL: 'http://127.0.0.1:8010',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        storageState: './tests/e2e/.auth/state.json',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    webServer: {
        command: 'bash -lc "npm run build && touch database/e2e.sqlite && DB_CONNECTION=sqlite DB_DATABASE=database/e2e.sqlite CACHE_STORE=array SESSION_DRIVER=cookie QUEUE_CONNECTION=sync php artisan migrate:fresh --seed --seeder=TestDataSeeder && DB_CONNECTION=sqlite DB_DATABASE=database/e2e.sqlite CACHE_STORE=array SESSION_DRIVER=cookie QUEUE_CONNECTION=sync php artisan serve --host=127.0.0.1 --port=8010"',
        url: 'http://127.0.0.1:8010',
        reuseExistingServer: !process.env.CI,
        timeout: 180 * 1000,
    },
});
