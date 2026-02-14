import { Github, Heart, Scale, Server } from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';

const stats = [
	{
		icon: Scale,
		label: 'MIT License',
		value: null,
		display: 'MIT',
		color: 'text-emerald-400',
		bgColor: 'bg-emerald-500/10',
	},
	{
		icon: Github,
		label: 'Código aberto',
		value: 100,
		suffix: '%',
		color: 'text-indigo-400',
		bgColor: 'bg-indigo-500/10',
	},
	{
		icon: Server,
		label: 'Self-hostable',
		value: null,
		display: '∞',
		color: 'text-purple-400',
		bgColor: 'bg-purple-500/10',
	},
	{
		icon: Heart,
		label: 'Vendor lock-in',
		value: 0,
		suffix: '',
		color: 'text-rose-400',
		bgColor: 'bg-rose-500/10',
	},
];

export default function Stats() {
	return (
		<section className="relative border-y border-white/5 bg-white/[0.01] py-16">
			<div className="mx-auto max-w-5xl px-6">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
					{stats.map((stat) => (
						<div key={stat.label} className="group text-center">
							<div
								className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}
							>
								<stat.icon className={`h-5 w-5 ${stat.color}`} />
							</div>
							<div className="mb-1 text-3xl font-bold text-white md:text-4xl">
								{stat.value !== null ? (
									<>
										<NumberTicker value={stat.value} className="text-white" />
										{stat.suffix && <span>{stat.suffix}</span>}
									</>
								) : (
									<span>{stat.display}</span>
								)}
							</div>
							<p className="text-sm text-slate-500">{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
