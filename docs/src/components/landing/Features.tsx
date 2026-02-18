import {
	Activity,
	BarChart3,
	Calendar,
	Columns3,
	Layers,
	Server,
	ShieldCheck,
	Zap,
} from 'lucide-react';

const featureCards = [
	{
		icon: Zap,
		title: 'Sprint Planning',
		description:
			'Arraste itens do backlog, defina estimativas e equilibre capacidade em tempo real.',
		color: 'text-[#7AA2FF]',
		borderColor: 'hover:border-[#5E6AD2]/35',
		glowColor: 'group-hover:bg-[#5E6AD2]/8',
	},
	{
		icon: ShieldCheck,
		title: 'Proteção de Capacidade',
		description:
			'Limites de WIP, reserva para N1 e alertas automáticos de sprint supercomprometida.',
		color: 'text-[#98A4F8]',
		borderColor: 'hover:border-[#7B87E8]/35',
		glowColor: 'group-hover:bg-[#7B87E8]/8',
	},
	{
		icon: BarChart3,
		title: 'Telemetria Completa',
		description:
			'Velocidade projetada, bloqueios e carga da equipe visíveis em tempo real.',
		color: 'text-[#74C1FF]',
		borderColor: 'hover:border-[#5FA8FF]/35',
		glowColor: 'group-hover:bg-[#5FA8FF]/8',
	},
	{
		icon: Columns3,
		title: 'Kanban Board',
		description:
			'Board visual com drag-and-drop, transições automáticas e rastreamento de tempo.',
		color: 'text-[#7A8FAF]',
		borderColor: 'hover:border-[#50627D]/35',
		glowColor: 'group-hover:bg-[#50627D]/10',
	},
	{
		icon: Calendar,
		title: 'Visão Calendário',
		description:
			'Sprint timeline com milestones, datas de entrega e visão macro do roadmap.',
		color: 'text-[#8AB6FF]',
		borderColor: 'hover:border-[#6D92D9]/35',
		glowColor: 'group-hover:bg-[#6D92D9]/8',
	},
	{
		icon: Server,
		title: 'Self-Hosting',
		description:
			'Docker Compose pronto. Seus dados, seu servidor, sem dependência externa.',
		color: 'text-[#A1B8FF]',
		borderColor: 'hover:border-[#8298EA]/35',
		glowColor: 'group-hover:bg-[#8298EA]/8',
	},
];

export default function Features() {
	return (
		<>
			<section
				id="features"
				className="relative overflow-hidden bg-[#090D15] px-6 py-24"
			>
				<div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5E6AD2]/10 blur-[128px]" />

				<div className="mx-auto max-w-6xl">
					<div className="mx-auto mb-20 max-w-3xl text-center">
						<h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
							Sinal vs. Ruído
						</h2>
						<p className="text-lg leading-relaxed text-slate-400">
							A maioria das ferramentas trata um bug crítico e uma solicitação de
							feature como o mesmo &quot;ticket&quot;. O Saturno separa duas
							geometrias distintas de trabalho:
						</p>
					</div>

					<div className="grid items-center gap-12 md:grid-cols-2">
						<div className="group relative rounded-3xl border border-amber-500/20 bg-[#0F131E] p-8 transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/35">
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
							<div className="relative z-10">
								<div className="mb-6 flex items-center gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/12 text-amber-400">
										<Activity className="h-6 w-6" />
									</div>
									<h3 className="text-2xl font-bold text-white">
										N1: O Ruído
									</h3>
								</div>
								<ul className="space-y-4 text-slate-400">
									<li className="flex items-start gap-3">
										<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
										<span>Trabalho reativo (Incidentes, Bugs)</span>
									</li>
									<li className="flex items-start gap-3">
										<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
										<span>Taxa de chegada imprevisível</span>
									</li>
									<li className="flex items-start gap-3">
										<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
										<span>Objetivo: Minimizar o tempo médio de resolução</span>
									</li>
								</ul>
							</div>
						</div>

						<div className="group relative rounded-3xl border border-[#5FA8FF]/25 bg-[#0F131E] p-8 transition-all duration-500 hover:scale-[1.02] hover:border-[#5FA8FF]/45">
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5FA8FF]/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
							<div className="relative z-10">
								<div className="mb-6 flex items-center gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5FA8FF]/12 text-[#8CC5FF]">
										<Layers className="h-6 w-6" />
									</div>
									<h3 className="text-2xl font-bold text-white">
										N2: O Sinal
									</h3>
								</div>
								<ul className="space-y-4 text-slate-400">
									<li className="flex items-start gap-3">
										<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#74B8FF]" />
										<span>
											Trabalho planejado (Funcionalidades, Roadmap)
										</span>
									</li>
									<li className="flex items-start gap-3">
										<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#74B8FF]" />
										<span>Limites de WIP controlados</span>
									</li>
									<li className="flex items-start gap-3">
										<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#74B8FF]" />
										<span>
											Objetivo: Maximizar throughput e previsibilidade
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="showcase" className="relative px-6 py-24">
				<div className="mx-auto max-w-6xl">
					<div className="mx-auto mb-16 max-w-3xl text-center">
						<p className="mb-4 text-sm font-semibold tracking-widest text-[#9BA5F8] uppercase">
							O que vem incluso
						</p>
						<h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
							Tudo para gerenciar sprints
						</h2>
						<p className="text-lg text-slate-400">
							Funcionalidades construídas para times de engenharia que precisam
							de resultados, não de burocracia.
						</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{featureCards.map((feature) => (
							<div
								key={feature.title}
								className={`group relative rounded-2xl border border-white/5 bg-[#0F111A]/80 p-6 transition-all duration-500 ${feature.borderColor}`}
							>
								<div
									className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity ${feature.glowColor} group-hover:opacity-100`}
								/>

								<div className="relative z-10">
									<div
										className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 ${feature.color}`}
									>
										<feature.icon className="h-5 w-5" />
									</div>
									<h3 className="mb-2 text-lg font-semibold text-white">
										{feature.title}
									</h3>
									<p className="text-sm leading-relaxed text-slate-400">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
