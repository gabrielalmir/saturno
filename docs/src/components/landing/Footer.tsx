import { Github, Linkedin, Twitter } from 'lucide-react';
import AppLogo from '@/components/AppLogo';

export default function Footer() {
	return (
		<footer
			id="footer"
			className="border-t border-white/5 bg-[#0B0D13] px-6 pt-16 pb-8"
		>
			<div className="mx-auto mb-12 grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
				<div className="col-span-2 lg:col-span-2">
					<div className="mb-4">
						<AppLogo />
					</div>
					<p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-400">
						Sprint management open source e self-hosted. Planeje, desenvolva e
						entregue com total controle sobre seus dados.
					</p>
					<div className="flex gap-4">
						{[
							{
								key: 'github',
								href: 'https://github.com/gabrielalmir/saturno',
								Icon: Github,
							},
							{
								key: 'twitter',
								href: 'https://x.com/gabrielalmir',
								Icon: Twitter,
							},
							{
								key: 'linkedin',
								href: 'https://www.linkedin.com/in/gabrielalmir',
								Icon: Linkedin,
							},
						].map(({ key, href, Icon }) => (
							<a
								key={key}
								href={href}
								target="_blank"
								rel="noreferrer"
								className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
							>
								<span className="sr-only">{key}</span>
								<Icon className="h-4 w-4" />
							</a>
						))}
					</div>
				</div>

				<div>
					<h3 className="mb-4 text-sm font-semibold text-white">Produto</h3>
					<ul className="space-y-3 text-sm text-slate-400">
						<li>
							<a href="#planning" className="transition-colors hover:text-indigo-400">
								Planejamento
							</a>
						</li>
						<li>
							<a href="#boards" className="transition-colors hover:text-indigo-400">
								Quadros Sprint
							</a>
						</li>
						<li>
							<a href="#showcase" className="transition-colors hover:text-indigo-400">
								Roadmaps
							</a>
						</li>
						<li>
							<a href="#intelligence" className="transition-colors hover:text-indigo-400">
								Inteligência
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="mb-4 text-sm font-semibold text-white">Recursos</h3>
					<ul className="space-y-3 text-sm text-slate-400">
						<li>
							<a href="/docs/" className="transition-colors hover:text-indigo-400">
								Documentação
							</a>
						</li>
						<li>
							<a
								href="https://github.com/gabrielalmir/saturno"
								target="_blank"
								rel="noreferrer"
								className="transition-colors hover:text-indigo-400"
							>
								API
							</a>
						</li>
						<li>
							<a
								href="https://github.com/gabrielalmir/saturno/discussions"
								target="_blank"
								rel="noreferrer"
								className="transition-colors hover:text-indigo-400"
							>
								Comunidade
							</a>
						</li>
						<li>
							<a
								href="https://github.com/gabrielalmir/saturno/blob/main/README.md"
								target="_blank"
								rel="noreferrer"
								className="transition-colors hover:text-indigo-400"
							>
								Manifesto
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="mb-4 text-sm font-semibold text-white">Comunidade</h3>
					<ul className="space-y-3 text-sm text-slate-400">
						<li>
							<a
								href="https://github.com/gabrielalmir/saturno"
								target="_blank"
								rel="noreferrer"
								className="transition-colors hover:text-indigo-400"
							>
								GitHub
							</a>
						</li>
						<li>
							<a
								href="https://github.com/gabrielalmir/saturno/issues"
								target="_blank"
								rel="noreferrer"
								className="transition-colors hover:text-indigo-400"
							>
								Issues & Bugs
							</a>
						</li>
						<li>
							<a
								href="https://github.com/gabrielalmir/saturno/discussions"
								target="_blank"
								rel="noreferrer"
								className="transition-colors hover:text-indigo-400"
							>
								Discussões
							</a>
						</li>
						<li>
							<a
								href="https://github.com/gabrielalmir/saturno/blob/main/CONTRIBUTING.md"
								target="_blank"
								rel="noreferrer"
								className="transition-colors hover:text-indigo-400"
							>
								Contribuir
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-500 md:flex-row">
				<div>
					© 2026 Saturno. Open Source (MIT License).{' '}
					<a
						href="https://github.com/gabrielalmir/saturno"
						target="_blank"
						rel="noreferrer"
						className="text-indigo-400 hover:text-indigo-300"
					>
						Feito com ❤️ por Gabriel Almir
					</a>
				</div>
				<div className="flex gap-6">
					<a
						href="https://github.com/gabrielalmir/saturno"
						target="_blank"
						rel="noreferrer"
						className="hover:text-white"
					>
						Privacidade
					</a>
					<a
						href="https://github.com/gabrielalmir/saturno"
						target="_blank"
						rel="noreferrer"
						className="hover:text-white"
					>
						Termos
					</a>
					<a
						href="https://github.com/gabrielalmir/saturno"
						target="_blank"
						rel="noreferrer"
						className="hover:text-white"
					>
						Cookies
					</a>
				</div>
			</div>
		</footer>
	);
}
