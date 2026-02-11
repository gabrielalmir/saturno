import { ShieldCheck, Layers, Activity, Zap, BarChart3 } from 'lucide-react';

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
                            solicitação de feature como o mesmo "ticket". O
                            Saturno separa duas geometrias distintas de
                            trabalho:
                        </p>
                    </div>

                    <div className="grid items-center gap-12 md:grid-cols-2">
                        {/* N1 Card */}
                        <div className="group relative rounded-3xl border border-rose-500/20 bg-[#0F111A] p-8 transition-all duration-500 hover:scale-[1.02] hover:transform hover:border-rose-500/40">
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
                        <div className="group relative rounded-3xl border border-emerald-500/20 bg-[#0F111A] p-8 transition-all duration-500 hover:scale-[1.02] hover:transform hover:border-emerald-500/40">
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

            {/* Zig-Zag Showcase */}
            <section id="showcase" className="relative px-6 py-24">
                <div className="mx-auto max-w-6xl space-y-32">
                    {/* Feature 1 */}
                    <div
                        id="planning"
                        className="flex flex-col items-center gap-16 md:flex-row"
                    >
                        <div className="space-y-6 md:w-1/2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                                <Zap className="h-3 w-3" /> Planejamento de
                                Sprint
                            </div>
                            <h3 className="text-3xl font-bold text-white md:text-4xl">
                                Arraste. Solte. Feito.
                            </h3>
                            <p className="text-lg leading-relaxed text-slate-400">
                                Um quadro de planejamento tátil que parece
                                físico. Mova itens do backlog para pronto,
                                defina estimativas visuais e equilibre a
                                capacidade da sprint em tempo real.
                            </p>
                        </div>
                        <div className="group relative md:w-1/2">
                            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl transition duration-500 group-hover:opacity-40" />
                            <div className="relative rounded-xl border border-white/10 bg-[#161821] p-2 transition duration-500 hover:scale-[1.02] hover:transform">
                                {/* Feature Image */}
                                <img
                                    src="/images/features/sprint-planning.png"
                                    alt="Visualização do Quadro da Sprint"
                                    className="aspect-[4/3] w-full rounded-lg object-cover shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div
                        id="boards"
                        className="flex flex-col items-center gap-16 md:flex-row-reverse"
                    >
                        <div className="space-y-6 md:w-1/2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                                <ShieldCheck className="h-3 w-3" /> Proteção de
                                Capacidade
                            </div>
                            <h3 className="text-3xl font-bold text-white md:text-4xl">
                                Escudos contra burnout
                            </h3>
                            <p className="text-lg leading-relaxed text-slate-400">
                                Defina limites rígidos de WIP e reserve
                                capacidade para interrupções N1. O Saturno
                                sinaliza automaticamente quando sua sprint está
                                supercomprometida antes mesmo de começar.
                            </p>
                        </div>
                        <div className="group relative md:w-1/2">
                            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl transition duration-500 group-hover:opacity-40" />
                            <div className="relative rounded-xl border border-white/10 bg-[#161821] p-2 transition duration-500 hover:scale-[1.02] hover:transform">
                                <img
                                    src="/images/features/capacity-protection.png"
                                    alt="Proteção de Capacidade"
                                    className="aspect-[4/3] w-full rounded-lg object-cover shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div
                        id="intelligence"
                        className="flex flex-col items-center gap-16 md:flex-row"
                    >
                        <div className="space-y-6 md:w-1/2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                <BarChart3 className="h-3 w-3" /> Visibilidade
                                Orbital
                            </div>
                            <h3 className="text-3xl font-bold text-white md:text-4xl">
                                Telemetria Completa
                            </h3>
                            <p className="text-lg leading-relaxed text-slate-400">
                                Veja quem está bloqueado, quem está
                                sobrecarregado e sua velocidade projetada em
                                tempo real. Chega de perguntar "qual é o
                                status?" na daily.
                            </p>
                        </div>
                        <div className="group relative md:w-1/2">
                            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-20 blur-xl transition duration-500 group-hover:opacity-40" />
                            <div className="relative rounded-xl border border-white/10 bg-[#161821] p-2 transition duration-500 hover:scale-[1.02] hover:transform">
                                <img
                                    src="/images/features/telemetry.png"
                                    alt="Telemetria Completa"
                                    className="aspect-[4/3] w-full rounded-lg object-cover shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
