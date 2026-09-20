import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md border border-border-subtle bg-surface p-1 text-text-primary shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                <AppLogoIcon className="h-full w-full" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <div className="mb-0.5 flex items-center gap-2 leading-tight">
                    <span className="truncate font-semibold text-text-primary">
                        Saturno
                    </span>
                    <span className="rounded-full border border-border-subtle bg-muted/40 px-2 py-0.5 text-[10px] text-text-secondary">
                        <AnimatedShinyText className="text-[10px] text-text-secondary">
                            v1
                        </AnimatedShinyText>
                    </span>
                </div>
                <span className="truncate text-[10px] text-text-tertiary">
                    Gestão de Sprints
                </span>
            </div>
        </>
    );
}
