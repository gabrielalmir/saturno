import { useCallback, useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'dark';
export type Appearance = 'dark';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();
let currentAppearance: Appearance = 'dark';

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    return 'dark';
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') return;

    document.documentElement.classList.toggle('dark', appearance === 'dark');
    document.documentElement.style.colorScheme = 'dark';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeTheme(): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('appearance', 'dark');
    setCookie('appearance', 'dark');
    currentAppearance = getStoredAppearance();
    applyTheme(currentAppearance);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'dark',
    );
    const resolvedAppearance: ResolvedAppearance = 'dark';

    const updateAppearance = useCallback((mode: Appearance): void => {
        void mode;
        currentAppearance = 'dark';

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', 'dark');

        // Store in cookie for SSR...
        setCookie('appearance', 'dark');

        applyTheme('dark');
        notify();
    }, []);

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
