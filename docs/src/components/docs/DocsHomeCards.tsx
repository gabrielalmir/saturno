import {
	ArrowRight,
	Blocks,
	BookOpenText,
	PlugZap,
	Rocket,
	Server,
	ShieldCheck,
} from 'lucide-react';

type Card = {
	section: string;
	title: string;
	description: string;
	href: string;
	timeToValue: string;
	highlights: string[];
	tone: 'launch' | 'workflow' | 'infra' | 'integration' | 'reference' | 'contribute';
	icon: React.ComponentType<{ className?: string }>;
};

const cards: Card[] = [
	{
		section: 'Onboarding',
		title: 'Quick Start',
		description: 'Suba o stack localmente em minutos e valide o primeiro fluxo end-to-end.',
		href: '/docs/getting-started/quick-start/',
		timeToValue: '10 min',
		highlights: ['Docker', 'Config inicial', 'Primeiro login'],
		tone: 'launch',
		icon: Rocket,
	},
	{
		section: 'Operação diária',
		title: 'Guias de Uso',
		description: 'Domine planejamento de sprint, board Kanban, calendário e gestão de épicos.',
		href: '/docs/guides/first-project/',
		timeToValue: '20 min',
		highlights: ['Sprint', 'Board', 'Calendário'],
		tone: 'workflow',
		icon: Blocks,
	},
	{
		section: 'Infraestrutura',
		title: 'Self Hosting',
		description: 'Prepare requisitos, banco de dados, Docker e deployment para produção.',
		href: '/docs/self-hosting/requirements/',
		timeToValue: '30 min',
		highlights: ['Requisitos', 'Banco', 'Deploy'],
		tone: 'infra',
		icon: Server,
	},
	{
		section: 'Automação',
		title: 'Integrações',
		description: 'Conecte e-mail, webhooks e autenticação para fluxos programáticos.',
		href: '/docs/integrations/email/',
		timeToValue: '18 min',
		highlights: ['Webhooks', 'Auth', 'E-mail'],
		tone: 'integration',
		icon: PlugZap,
	},
	{
		section: 'Consulta técnica',
		title: 'Referência',
		description: 'API, variáveis de ambiente e permissões.',
		href: '/docs/reference/api/',
		timeToValue: '15 min',
		highlights: ['API', 'Env vars', 'ACL'],
		tone: 'reference',
		icon: BookOpenText,
	},
	{
		section: 'Open source',
		title: 'Contribuindo',
		description: 'Fluxo técnico para desenvolvimento, testes e PRs.',
		href: '/docs/contributing/development/',
		timeToValue: '25 min',
		highlights: ['Arquitetura', 'Testes', 'PR'],
		tone: 'contribute',
		icon: ShieldCheck,
	},
];

export default function DocsHomeCards() {
	return (
		<section className="docs-home-grid" aria-label="Atalhos da documentação">
			{cards.map((card) => {
				const Icon = card.icon;
				return (
					<a key={card.href} href={card.href} className={`docs-home-card docs-home-card--${card.tone}`}>
						<div className="docs-home-card-head">
							<span className="docs-home-eyebrow">{card.section}</span>
							<span className="docs-home-time">{card.timeToValue}</span>
						</div>
						<div className="docs-home-card-main">
							<h3>{card.title}</h3>
							<p>{card.description}</p>
							<ul className="docs-home-highlights" aria-label={`Tópicos de ${card.title}`}>
								{card.highlights.map((highlight) => (
									<li key={highlight}>{highlight}</li>
								))}
							</ul>
						</div>
						<div className="docs-home-icon-wrap">
							<Icon className="docs-home-icon" />
						</div>
						<span className="docs-home-card-action">
							Acessar trilha
							<ArrowRight className="docs-home-arrow" />
						</span>
					</a>
				);
			})}
		</section>
	);
}
