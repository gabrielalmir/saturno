import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const manifestoPillars = [
	{
		title: 'Open source por design',
		description:
			'Código aberto, decisões transparentes e uma comunidade que define os próximos passos em conjunto.',
	},
	{
		title: 'Operação com contexto real',
		description:
			'De roadmap até incidentes, Saturno organiza prioridades por impacto para reduzir ruído e acelerar entrega.',
	},
	{
		title: 'Colaboração sem atrito',
		description:
			'Produto, engenharia e liderança compartilham a mesma visão em tempo real para decidir melhor e mais rápido.',
	},
];

export default function ManifestoSection() {
	return (
		<section id="manifesto" className="px-6 py-24">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#5E6AD2]/14 via-[#0B0F18] to-[#5FA8FF]/10 p-8 shadow-[0_30px_120px_rgba(26,35,68,0.38)] md:p-12">
					<div className="max-w-3xl">
						<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#9BA5F8] uppercase">
							<Sparkles className="h-3.5 w-3.5" />
							Manifesto Saturno
						</div>
						<h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
							Construindo o sistema operacional da engenharia open source.
						</h2>
						<p className="mt-5 text-base leading-relaxed text-slate-300 md:text-lg">
							Acreditamos que equipes extraordinárias precisam de clareza, não de
							burocracia. Saturno nasce para ser a camada de coordenação que
							transforma estratégia em entregas consistentes — com transparência,
							autonomia e responsabilidade compartilhada.
						</p>
					</div>

					<div className="mt-10 grid gap-4 md:grid-cols-3">
						{manifestoPillars.map((pillar) => (
							<article
								key={pillar.title}
								className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
							>
								<h3 className="text-lg font-semibold text-white">
									{pillar.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-slate-300">
									{pillar.description}
								</p>
							</article>
						))}
					</div>

					<div className="mt-10 flex flex-wrap items-center gap-3">
						<a
							href="https://github.com/gabrielalmir/saturno/blob/main/README.md"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button className="h-11 rounded-full bg-[#5E6AD2] px-6 text-white hover:bg-[#6A77DF]">
								Ver manifesto completo no GitHub
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</a>
						<p className="text-sm text-slate-400">
							Resumo estratégico do produto e da visão de engenharia do Saturno.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
