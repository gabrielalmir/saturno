import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Saturno';
const ASSET_RECOVERY_FLAG = 'saturno:asset-recovery-reloaded';

const shouldReloadForMissingChunk = (error: unknown): boolean => {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const message = 'message' in error ? error.message : '';

    return (
        typeof message === 'string' &&
        (message.includes('Failed to fetch dynamically imported module') ||
            message.includes('Importing a module script failed'))
    );
};

window.addEventListener('unhandledrejection', (event) => {
    if (!shouldReloadForMissingChunk(event.reason)) {
        return;
    }

    if (sessionStorage.getItem(ASSET_RECOVERY_FLAG) === 'true') {
        sessionStorage.removeItem(ASSET_RECOVERY_FLAG);

        return;
    }

    sessionStorage.setItem(ASSET_RECOVERY_FLAG, 'true');
    window.location.reload();
});

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
