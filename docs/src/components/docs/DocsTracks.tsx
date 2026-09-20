import { ArrowUpRight, Cable, Gauge, ServerCog } from 'lucide-react';

type Track = {
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	links: Array<{ label: string; href: string }>;
};

const tracks: Track[] = [
	{
		title: 'Adoção no time',
		description: 'Para líderes técnicos que precisam colocar o Saturno em produção de uso do time rapidamente.',
		icon: Gauge,
		links: [
			{ label: 'Primeiro Projeto', href: '/docs/guides/first-project/' },
			{ label: 'Planejamento de Sprints', href: '/docs/guides/planning-sprints/' },
			{ label: 'Kanban Board', href: '/docs/guides/kanban-board/' },
		],
	},
	{
		title: 'Plataforma e DevOps',
		description: 'Para setup de infraestrutura, banco de dados e deployment com previsibilidade operacional.',
		icon: ServerCog,
		links: [
			{ label: 'Requisitos', href: '/docs/self-hosting/requirements/' },
			{ label: 'Banco de Dados', href: '/docs/self-hosting/database/' },
			{ label: 'Deploy em Produção', href: '/docs/self-hosting/production-deploy/' },
		],
	},
	{
		title: 'Integrações e automação',
		description: 'Para conectar o Saturno com serviços externos e habilitar fluxos orientados a API.',
		icon: Cable,
		links: [
			{ label: 'Autenticação da API', href: '/docs/integrations/api-authentication/' },
			{ label: 'Webhooks', href: '/docs/integrations/webhooks/' },
			{ label: 'E-mail', href: '/docs/integrations/email/' },
		],
	},
];

export default function DocsTracks() {
	return (
		<section className="docs-tracks" aria-label="Trilhas por objetivo">
			{tracks.map((track) => {
				const Icon = track.icon;
				return (
					<article key={track.title} className="docs-track-card">
						<div className="docs-track-header">
							<span className="docs-track-icon-wrap">
								<Icon className="docs-track-icon" />
							</span>
							<h3>{track.title}</h3>
						</div>
						<p>{track.description}</p>
						<ul className="docs-track-links">
							{track.links.map((link) => (
								<li key={link.href}>
									<a href={link.href}>
										{link.label}
										<ArrowUpRight className="docs-track-arrow" />
									</a>
								</li>
							))}
						</ul>
					</article>
				);
			})}
		</section>
	);
}
