import { ArrowRight, Github, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Button } from '@/components/ui/button';
import { Particles } from '@/components/ui/particles';

function TerminalBlock() {
	const lines = [
		{ prompt: true, text: 'git clone https://github.com/gabrielalmir/saturno.git' },
		{ prompt: true, text: 'cd saturno && cp .env.example .env' },
		{ prompt: true, text: 'docker compose up -d' },
		{ prompt: false, text: '✓ Container saturno-db-1     Started' },
		{ prompt: false, text: '✓ Container saturno-app-1    Started' },
		{ prompt: true, text: 'docker compose exec app php artisan migrate --force' },
		{ prompt: false, text: '' },
		{ prompt: false, text: '🚀 Saturno running at http://localhost:8080' },
	];

	const [visibleLines, setVisibleLines] = useState(0);

	useEffect(() => {
		if (visibleLines < lines.length) {
			const timeout = setTimeout(
				() => setVisibleLines((v) => v + 1),
				visibleLines === 0 ? 800 : 400 + Math.random() * 300
			);
			return () => clearTimeout(timeout);
		}
	}, [visibleLines, lines.length]);

	return (
		<div className="relative mx-auto mt-20 max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0A0C12] ring-1 ring-[#5E6AD2]/25 shadow-[0_0_0_1px_rgba(94,106,210,0.16),0_0_34px_rgba(94,106,210,0.14),0_0_64px_rgba(95,168,255,0.08)]">
			{/* Title bar */}
			<div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
				<div className="flex gap-1.5">
					<div className="h-3 w-3 rounded-full bg-red-500/70" />
					<div className="h-3 w-3 rounded-full bg-yellow-500/70" />
					<div className="h-3 w-3 rounded-full bg-green-500/70" />
				</div>
				<div className="flex items-center gap-1.5 text-xs text-slate-500">
					<Terminal className="h-3 w-3" />
					terminal
				</div>
			</div>

			{/* Content */}
			<div className="p-5 font-mono text-sm leading-relaxed">
				{lines.slice(0, visibleLines).map((line, i) => (
					<div
						key={i}
						className="animate-in fade-in slide-in-from-bottom-2 duration-300"
					>
						{line.prompt ? (
							<div className="flex gap-2">
								<span className="select-none text-emerald-400">$</span>
								<span className="text-slate-300">{line.text}</span>
							</div>
						) : (
							<div className="text-slate-500">{line.text}</div>
						)}
					</div>
				))}
				{visibleLines < lines.length && (
					<div className="flex gap-2">
						<span className="select-none text-emerald-400">$</span>
						<span className="inline-block h-5 w-2 animate-pulse bg-slate-400" />
					</div>
				)}
			</div>
		</div>
	);
}

export default function Hero() {
	return (
		<section
			id="top"
			className="relative min-h-[90vh] overflow-hidden px-6 pt-32 pb-20"
		>
			<Particles
				className="absolute inset-0 z-0"
				quantity={80}
				staticity={40}
				color="#5e6ad2"
				ease={60}
				size={0.4}
			/>
			<Particles
				className="absolute inset-0 z-0"
				quantity={40}
				staticity={50}
				color="#5fa8ff"
				ease={80}
				size={0.3}
			/>

			<div className="relative z-10 mx-auto max-w-5xl text-center">
				<div className="mb-8 inline-flex animate-in items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-400 duration-700 fade-in slide-in-from-bottom-4">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
					</span>
					Open Source & MIT Licensed
				</div>

				<h1 className="font-display mb-8 animate-in text-5xl leading-[0.95] font-extrabold tracking-tight text-white delay-100 duration-700 fade-in slide-in-from-bottom-8 sm:text-6xl md:text-8xl">
					O sistema de sprints{' '}
					<br className="hidden sm:block" />
					<AnimatedGradientText
						className="font-display"
						speed={1.4}
						colorFrom="#5E6AD2"
						colorTo="#8FA3FF"
					>
						open source
					</AnimatedGradientText>
				</h1>

				<p className="mx-auto max-w-2xl animate-in text-lg leading-relaxed text-slate-400 delay-200 duration-700 fade-in slide-in-from-bottom-8 md:text-xl">
					Self-hosted, sem vendor lock-in e sem limites artificiais.{' '}
					<br className="hidden md:block" />
					Planeje sprints, proteja capacidade e entregue com visibilidade total.
				</p>

				<div className="mt-10 flex animate-in flex-col items-center justify-center gap-4 delay-300 duration-700 fade-in slide-in-from-bottom-8 sm:flex-row">
					<ShimmerButton
						asChild
						className="h-14 min-h-14 px-8 text-base font-semibold"
						background="rgba(94,106,210,0.92)"
						shimmerColor="#ffffff"
						shimmerDuration="2.6s"
					>
						<a
							href="https://github.com/gabrielalmir/saturno"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center"
						>
							<Github className="mr-2 h-5 w-5" />
							Star on GitHub
						</a>
					</ShimmerButton>

					<a href="/docs/">
						<Button
							size="lg"
							variant="outline"
							className="h-14 min-h-14 rounded-full border-white/10 bg-white/5 px-8 text-base font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
						>
							Começar self-hosting
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</a>
				</div>

				<TerminalBlock />
			</div>
		</section>
	);
}
