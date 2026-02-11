import { Link } from '@inertiajs/react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import AppLogo from '@/components/app-logo';

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
                        A plataforma de engenharia que substitui o caos por
                        clareza. Planeje, desenvolva e entregue com velocidade
                        de dobra.
                    </p>
                    <div className="flex gap-4">
                        {[
                            {
                                key: 'twitter',
                                href: 'https://x.com/',
                                Icon: Twitter,
                            },
                            {
                                key: 'github',
                                href: 'https://github.com/',
                                Icon: Github,
                            },
                            {
                                key: 'linkedin',
                                href: 'https://www.linkedin.com/',
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
                    <h3 className="mb-4 text-sm font-semibold text-white">
                        Produto
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li>
                            <a
                                href="#planning"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Planejamento
                            </a>
                        </li>
                        <li>
                            <a
                                href="#boards"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Quadros Sprint
                            </a>
                        </li>
                        <li>
                            <a
                                href="#showcase"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Roadmaps
                            </a>
                        </li>
                        <li>
                            <a
                                href="#intelligence"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Inteligência
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold text-white">
                        Recursos
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li>
                            <Link
                                href="/docs"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Documentação
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/api"
                                className="transition-colors hover:text-indigo-400"
                            >
                                API
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/community"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Comunidade
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/manifesto"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Manifesto
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold text-white">
                        Empresa
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li>
                            <Link
                                href="/sobre"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Sobre
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/carreiras"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Carreiras
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/blog"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contato"
                                className="transition-colors hover:text-indigo-400"
                            >
                                Contato
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-500 md:flex-row">
                <div>© 2026 Saturno Inc. Todos os direitos reservados.</div>
                <div className="flex gap-6">
                    <Link
                        href="/privacidade"
                        className="transition-colors hover:text-white"
                    >
                        Privacidade
                    </Link>
                    <Link
                        href="/termos"
                        className="transition-colors hover:text-white"
                    >
                        Termos
                    </Link>
                    <Link
                        href="/cookies"
                        className="transition-colors hover:text-white"
                    >
                        Cookies
                    </Link>
                </div>
            </div>
        </footer>
    );
}
