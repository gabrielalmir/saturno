import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden shadow-lg">
                <AppLogoIcon className="h-full w-full object-cover" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <div className="mb-0.5 flex items-center gap-2 leading-tight">
                    <span className="truncate bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text font-semibold text-transparent">
                        Saturno
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px]">
                        <AnimatedShinyText className="text-[10px]">
                            v1
                        </AnimatedShinyText>
                    </span>
                </div>
                <span className="truncate text-[10px] text-muted-foreground">
                    Gestão de Sprints
                </span>
            </div>
        </>
    );
}
