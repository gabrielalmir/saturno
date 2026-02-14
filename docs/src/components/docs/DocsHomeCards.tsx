import { Blocks, Rocket, Server, PlugZap, BookOpenText, ShieldCheck, ArrowRight } from 'lucide-react';

type Card = {
	title: string;
	description: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
};

const cards: Card[] = [
	{
		title: 'Quick Start',
		description: 'Suba o Saturno localmente em minutos e valide o fluxo inicial.',
		href: '/docs/getting-started/quick-start/',
		icon: Rocket,
	},
	{
		title: 'Guias de Uso',
		description: 'Planejamento de sprint, board Kanban, calendário e épicos.',
		href: '/docs/guides/first-project/',
		icon: Blocks,
	},
	{
		title: 'Self Hosting',
		description: 'Requisitos, banco, Docker e deploy de produção.',
		href: '/docs/self-hosting/requirements/',
		icon: Server,
	},
	{
		title: 'Integrações',
		description: 'E-mail, webhooks e autenticação para uso programático.',
		href: '/docs/integrations/email/',
		icon: PlugZap,
	},
	{
		title: 'Referência',
		description: 'API, variáveis de ambiente e permissões.',
		href: '/docs/reference/api/',
		icon: BookOpenText,
	},
	{
		title: 'Contribuindo',
		description: 'Fluxo técnico para desenvolvimento, testes e PRs.',
		href: '/docs/contributing/development/',
		icon: ShieldCheck,
	},
];

export default function DocsHomeCards() {
	return (
		<section className="docs-home-grid" aria-label="Atalhos da documentação">
			{cards.map((card) => {
				const Icon = card.icon;
				return (
					<a key={card.href} href={card.href} className="docs-home-card">
						<div className="docs-home-icon-wrap">
							<Icon className="docs-home-icon" />
						</div>
						<div>
							<h3>{card.title}</h3>
							<p>{card.description}</p>
						</div>
						<span className="docs-home-card-action">
							Ver seção
							<ArrowRight className="docs-home-arrow" />
						</span>
					</a>
				);
			})}
		</section>
	);
}
