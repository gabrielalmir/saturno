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
        color: 'text-blue-400',
        borderColor: 'hover:border-blue-500/30',
        glowColor: 'group-hover:bg-blue-500/5',
    },
    {
        icon: ShieldCheck,
        title: 'Proteção de Capacidade',
        description:
            'Limites de WIP, reserva para N1 e alertas automáticos de sprint supercomprometida.',
        color: 'text-purple-400',
        borderColor: 'hover:border-purple-500/30',
        glowColor: 'group-hover:bg-purple-500/5',
    },
    {
        icon: BarChart3,
        title: 'Telemetria Completa',
        description:
            'Velocidade projetada, bloqueios e carga da equipe visíveis em tempo real.',
        color: 'text-emerald-400',
        borderColor: 'hover:border-emerald-500/30',
        glowColor: 'group-hover:bg-emerald-500/5',
    },
    {
        icon: Columns3,
        title: 'Kanban Board',
        description:
            'Board visual com drag-and-drop, transições automáticas e rastreamento de tempo.',
        color: 'text-amber-400',
        borderColor: 'hover:border-amber-500/30',
        glowColor: 'group-hover:bg-amber-500/5',
    },
    {
        icon: Calendar,
        title: 'Visão Calendário',
        description:
            'Sprint timeline com milestones, datas de entrega e visão macro do roadmap.',
        color: 'text-rose-400',
        borderColor: 'hover:border-rose-500/30',
        glowColor: 'group-hover:bg-rose-500/5',
    },
    {
        icon: Server,
        title: 'Self-Hosting',
        description:
            'Docker Compose pronto. Seus dados, seu servidor, sem dependência externa.',
        color: 'text-cyan-400',
        borderColor: 'hover:border-cyan-500/30',
        glowColor: 'group-hover:bg-cyan-500/5',
    },
];

export default function Features() {
    return (
        <>
            {/* N1 vs N2 Philosophy Section */}
            <section
                id="features"
                className="relative overflow-hidden bg-[#0B0D13] px-6 py-24"
            >
                <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[128px]" />

                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-20 max-w-3xl text-center">
                        <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
                            Sinal vs. Ruído
                        </h2>
                        <p className="text-lg leading-relaxed text-slate-400">
                            A maioria das ferramentas trata um bug crítico e uma
                            solicitação de feature como o mesmo &quot;ticket&quot;. O
                            Saturno separa duas geometrias distintas de
                            trabalho:
                        </p>
                    </div>

                    <div className="grid items-center gap-12 md:grid-cols-2">
                        {/* N1 Card */}
                        <div className="group relative rounded-3xl border border-rose-500/20 bg-[#0F111A] p-8 transition-all duration-500 hover:scale-[1.02] hover:border-rose-500/40">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative z-10">
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        N1: O Ruído
                                    </h3>
                                </div>
                                <ul className="space-y-4 text-slate-400">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                                        <span>
                                            Trabalho reativo (Incidentes, Bugs)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                                        <span>
                                            Taxa de chegada imprevisível
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                                        <span>
                                            Objetivo: Minimizar o tempo médio de
                                            resolução
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* N2 Card */}
                        <div className="group relative rounded-3xl border border-emerald-500/20 bg-[#0F111A] p-8 transition-all duration-500 hover:scale-[1.02] hover:border-emerald-500/40">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative z-10">
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                        <Layers className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        N2: O Sinal
                                    </h3>
                                </div>
                                <ul className="space-y-4 text-slate-400">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span>
                                            Trabalho planejado (Funcionalidades,
                                            Roadmap)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span>Limites de WIP controlados</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span>
                                            Objetivo: Maximizar throughput e
                                            previsibilidade
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid — Bento Style */}
            <section id="showcase" className="relative px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <p className="mb-4 text-sm font-semibold tracking-widest text-indigo-400 uppercase">
                            O que vem incluso
                        </p>
                        <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
                            Tudo para gerenciar sprints
                        </h2>
                        <p className="text-lg text-slate-400">
                            Funcionalidades construídas para times de engenharia
                            que precisam de resultados, não de burocracia.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {featureCards.map((feature) => (
                            <div
                                key={feature.title}
                                className={`group relative rounded-2xl border border-white/5 bg-[#0F111A]/80 p-6 transition-all duration-500 ${feature.borderColor}`}
                            >
                                {/* Hover Glow */}
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
