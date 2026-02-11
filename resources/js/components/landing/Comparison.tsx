import { Check, X } from 'lucide-react';

export default function Comparison() {
    return (
        <section id="comparison" className="bg-[#0B0D13] px-6 py-24">
            <div className="mx-auto max-w-4xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white">
                        Evolução, não só alternativa
                    </h2>
                    <p className="text-slate-400">
                        Pare de gerenciar tickets. Comece a gerenciar
                        engenharia.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Legacy Tools */}
                    <div className="rounded-2xl border border-white/5 bg-[#0F111A]/50 p-8 opacity-70 transition-opacity hover:opacity-100">
                        <h3 className="mb-6 text-xl font-semibold text-slate-300">
                            Ferramentas Legadas
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-500">
                                <X className="mt-0.5 h-5 w-5 text-rose-500/50" />
                                <span>Virada de sprint manual</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-500">
                                <X className="mt-0.5 h-5 w-5 text-rose-500/50" />
                                <span>UI genérica e poluída</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-500">
                                <X className="mt-0.5 h-5 w-5 text-rose-500/50" />
                                <span>Foco em "tickets", não no fluxo</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-500">
                                <X className="mt-0.5 h-5 w-5 text-rose-500/50" />
                                <span>Inferno de configurações infinitas</span>
                            </li>
                        </ul>
                    </div>

                    {/* Saturno */}
                    <div className="relative rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-8">
                        {/* Glow */}
                        <div className="absolute inset-0 -z-10 bg-indigo-500/5 blur-3xl" />

                        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                            Saturno
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-300">
                                <Check className="mt-0.5 h-5 w-5 text-indigo-400" />
                                <span>
                                    Planejamento de capacidade automatizado
                                </span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-300">
                                <Check className="mt-0.5 h-5 w-5 text-indigo-400" />
                                <span>
                                    Feito para equipes de alta velocidade
                                </span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-300">
                                <Check className="mt-0.5 h-5 w-5 text-indigo-400" />
                                <span>Distingue trabalho N1 vs N2</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-300">
                                <Check className="mt-0.5 h-5 w-5 text-indigo-400" />
                                <span>Fluxo opinativo, zero configuração</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
