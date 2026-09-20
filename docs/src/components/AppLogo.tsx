import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import AppLogoIcon from './AppLogoIcon';

export default function AppLogo() {
	return (
		<>
			<div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[#141922] p-1 text-white shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
				<AppLogoIcon className="h-full w-full" />
			</div>
			<div className="ml-1 grid flex-1 text-left text-sm">
				<div className="mb-0.5 flex items-center gap-2 leading-tight">
					<span className="truncate font-semibold text-white">Saturno</span>
					<span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
						<AnimatedShinyText className="text-[10px] text-slate-400">
							v1
						</AnimatedShinyText>
					</span>
				</div>
				<span className="truncate text-[10px] text-slate-500">
					Gestão de Sprints
				</span>
			</div>
		</>
	);
}
