import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Container,
    Database,
    Download,
    Github,
    HelpCircle,
    RefreshCw,
    Server,
    Terminal,
    Wrench,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

function CodeBlock({ children, title }: { children: string; title?: string }) {
    return (
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0D1117]">
            {title && (
                <div className="border-b border-white/5 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-400">
                    {title}
                </div>
            )}
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-300">
                <code>{children}</code>
            </pre>
        </div>
    );
}

function SectionHeading({
    icon: Icon,
    id,
    title,
    subtitle,
}: {
    icon: React.ElementType;
    id: string;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="mb-8" id={id}>
            <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                    <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <p className="text-slate-400">{subtitle}</p>
        </div>
    );
}

function Step({
    n,
    title,
    children,
}: {
    n: number;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                {n}
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <div className="space-y-3 text-slate-300">{children}</div>
            </div>
        </div>
    );
}

function EnvTable() {
    const vars = [
        ['APP_NAME', 'Saturno', 'Nome exibido na aplicação'],
        ['APP_ENV', 'production', 'Ambiente (production / local)'],
        ['APP_KEY', '(gerado)', 'Chave de criptografia (obrigatório)'],
        ['APP_URL', 'http://localhost:8080', 'URL pública da instância'],
        ['APP_PORT', '8080', 'Porta exposta no host (Docker)'],
        ['DB_CONNECTION', 'pgsql', 'Driver do banco de dados'],
        ['DB_HOST', 'db', 'Host do PostgreSQL (nome do serviço no Compose)'],
        ['DB_PORT', '5432', 'Porta do PostgreSQL'],
        ['DB_DATABASE', 'saturno', 'Nome do banco de dados'],
        ['DB_USERNAME', 'saturno', 'Usuário do banco'],
        ['DB_PASSWORD', 'changeme', 'Senha do banco (altere em produção!)'],
        ['MAIL_MAILER', 'log', 'Driver de e-mail (smtp / log / ses)'],
        ['QUEUE_CONNECTION', 'database', 'Driver de filas'],
    ];

    return (
        <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="px-4 py-3 font-semibold text-white">
                            Variável
                        </th>
                        <th className="px-4 py-3 font-semibold text-white">
                            Padrão
                        </th>
                        <th className="px-4 py-3 font-semibold text-white">
                            Descrição
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {vars.map(([name, def, desc]) => (
                        <tr
                            key={name}
                            className="border-b border-white/5 last:border-0"
                        >
                            <td className="px-4 py-2.5 font-mono text-indigo-300">
                                {name}
                            </td>
                            <td className="px-4 py-2.5 text-slate-400">
                                {def}
                            </td>
                            <td className="px-4 py-2.5 text-slate-300">
                                {desc}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function Docs() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-[#0B0D13] font-sans text-slate-200 selection:bg-indigo-500/30">
            <Head title="Documentação – Self-Hosting" />

            {/* Background */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#0B0D13_0%,transparent_100%)]" />
                <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 opacity-40 blur-[128px]" />
                <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-600/10 opacity-40 blur-[128px]" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0D13]/50 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo />
                        </Link>
                        <div className="flex items-center gap-3 text-sm">
                            <Link
                                href="/"
                                className="text-slate-400 hover:text-white"
                            >
                                Voltar
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-white/10 px-3 py-1.5 text-white hover:bg-white/20"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
                                    >
                                        Registrar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-6 py-14">
                    {/* Sidebar Navigation */}
                    <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
                        <p className="mb-4 text-xs font-semibold tracking-widest text-slate-500 uppercase">
                            Guia
                        </p>
                        <nav className="space-y-1 text-sm">
                            {[
                                {
                                    href: '#quick-start',
                                    icon: Download,
                                    label: 'Quick Start',
                                },
                                {
                                    href: '#env-vars',
                                    icon: Wrench,
                                    label: 'Variáveis de Ambiente',
                                },
                                {
                                    href: '#manual',
                                    icon: Terminal,
                                    label: 'Instalação Manual',
                                },
                                {
                                    href: '#updating',
                                    icon: RefreshCw,
                                    label: 'Atualizando',
                                },
                                {
                                    href: '#faq',
                                    icon: HelpCircle,
                                    label: 'FAQ',
                                },
                            ].map(({ href, icon: Icon, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-8 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                            <p className="mb-2 text-xs font-semibold text-slate-400">
                                Código-Fonte
                            </p>
                            <a
                                href="https://github.com/gabrielalmir/saturno"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
                            >
                                <Github className="h-4 w-4" />
                                gabrielalmir/saturno
                            </a>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="min-w-0 flex-1">
                        {/* Page header */}
                        <div className="mb-12">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                                <BookOpen className="h-3.5 w-3.5" />
                                Documentação
                            </div>
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                                Self-Hosting
                            </h1>
                            <p className="max-w-2xl text-lg text-slate-400">
                                Instale o Saturno na sua própria infraestrutura
                                em minutos. Seus dados, seu controle.
                            </p>
                        </div>

                        {/* Prerequisites badge */}
                        <div className="mb-12 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                            <p className="flex items-center gap-2 text-sm font-medium text-amber-400">
                                <Server className="h-4 w-4" />
                                Pré-requisitos
                            </p>
                            <ul className="mt-2 grid gap-1 text-sm text-slate-300 sm:grid-cols-2">
                                <li className="flex items-center gap-2">
                                    <Container className="h-3.5 w-3.5 text-slate-500" />
                                    Docker &amp; Docker Compose
                                </li>
                                <li className="flex items-center gap-2">
                                    <Database className="h-3.5 w-3.5 text-slate-500" />
                                    2 GB RAM mínimo
                                </li>
                            </ul>
                        </div>

                        {/* ── Section 1 — Quick Start ── */}
                        <section className="mb-16">
                            <SectionHeading
                                icon={Download}
                                id="quick-start"
                                title="Quick Start"
                                subtitle="Da zero ao running em 5 passos com Docker Compose."
                            />
                            <div className="space-y-8">
                                <Step n={1} title="Clone o repositório">
                                    <CodeBlock>
                                        {`git clone https://github.com/gabrielalmir/saturno.git\ncd saturno`}
                                    </CodeBlock>
                                </Step>

                                <Step n={2} title="Copie o arquivo de configuração">
                                    <CodeBlock>
                                        {`cp .env.example .env`}
                                    </CodeBlock>
                                    <p className="text-sm text-slate-400">
                                        Edite o{' '}
                                        <code className="rounded bg-white/10 px-1.5 py-0.5 text-indigo-300">
                                            .env
                                        </code>{' '}
                                        para ajustar a senha do banco e a URL da
                                        aplicação.
                                    </p>
                                </Step>

                                <Step n={3} title="Gere a chave da aplicação">
                                    <CodeBlock>
                                        {`docker compose run --rm app php artisan key:generate`}
                                    </CodeBlock>
                                </Step>

                                <Step n={4} title="Suba os containers">
                                    <CodeBlock>
                                        {`docker compose up -d`}
                                    </CodeBlock>
                                </Step>

                                <Step n={5} title="Execute as migrations">
                                    <CodeBlock>
                                        {`docker compose exec app php artisan migrate --force`}
                                    </CodeBlock>
                                    <p className="text-sm text-slate-400">
                                        Acesse{' '}
                                        <code className="rounded bg-white/10 px-1.5 py-0.5 text-indigo-300">
                                            http://localhost:8080
                                        </code>{' '}
                                        e crie sua primeira conta.
                                    </p>
                                </Step>
                            </div>
                        </section>

                        {/* ── Section 2 — Environment Variables ── */}
                        <section className="mb-16">
                            <SectionHeading
                                icon={Wrench}
                                id="env-vars"
                                title="Variáveis de Ambiente"
                                subtitle="Configuração completa via arquivo .env"
                            />
                            <EnvTable />
                            <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-300">
                                <strong>Importante:</strong> Altere{' '}
                                <code className="rounded bg-white/10 px-1.5 py-0.5">
                                    DB_PASSWORD
                                </code>{' '}
                                antes de expor a instância publicamente.
                            </div>
                        </section>

                        {/* ── Section 3 — Manual Installation ── */}
                        <section className="mb-16">
                            <SectionHeading
                                icon={Terminal}
                                id="manual"
                                title="Instalação Manual"
                                subtitle="Para quem prefere rodar sem Docker."
                            />
                            <div className="space-y-4 text-slate-300">
                                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                                    <p className="mb-3 text-sm font-semibold text-white">
                                        Requisitos
                                    </p>
                                    <ul className="grid gap-1 text-sm sm:grid-cols-2">
                                        <li>• PHP 8.2+ com extensões: bcmath, intl, pdo_pgsql, zip</li>
                                        <li>• Composer 2</li>
                                        <li>• Node.js 18+ &amp; npm</li>
                                        <li>• PostgreSQL 15+</li>
                                    </ul>
                                </div>

                                <CodeBlock title="Instalar dependências">
                                    {`composer install --no-dev --optimize-autoloader\nnpm ci && npm run build`}
                                </CodeBlock>

                                <CodeBlock title="Configurar ambiente">
                                    {`cp .env.example .env\nphp artisan key:generate`}
                                </CodeBlock>

                                <p className="text-sm text-slate-400">
                                    Edite o{' '}
                                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-indigo-300">
                                        .env
                                    </code>{' '}
                                    apontando{' '}
                                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-indigo-300">
                                        DB_HOST
                                    </code>{' '}
                                    para o endereço real do seu PostgreSQL (ex:{' '}
                                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-indigo-300">
                                        127.0.0.1
                                    </code>
                                    ).
                                </p>

                                <CodeBlock title="Executar migrations e iniciar">
                                    {`php artisan migrate --force\nphp artisan serve --host=0.0.0.0 --port=8080`}
                                </CodeBlock>
                            </div>
                        </section>

                        {/* ── Section 4 — Updating ── */}
                        <section className="mb-16">
                            <SectionHeading
                                icon={RefreshCw}
                                id="updating"
                                title="Atualizando"
                                subtitle="Como atualizar para novas versões."
                            />
                            <div className="space-y-4">
                                <CodeBlock title="Com Docker Compose">
                                    {`git pull origin main\ndocker compose build\ndocker compose up -d\ndocker compose exec app php artisan migrate --force`}
                                </CodeBlock>

                                <CodeBlock title="Instalação manual">
                                    {`git pull origin main\ncomposer install --no-dev --optimize-autoloader\nnpm ci && npm run build\nphp artisan migrate --force`}
                                </CodeBlock>
                            </div>
                        </section>

                        {/* ── Section 5 — FAQ ── */}
                        <section className="mb-16">
                            <SectionHeading
                                icon={HelpCircle}
                                id="faq"
                                title="FAQ"
                                subtitle="Problemas comuns e soluções."
                            />
                            <div className="space-y-4">
                                {[
                                    {
                                        q: 'A porta 8080 já está em uso',
                                        a: 'Altere APP_PORT no .env para outra porta (ex: 3000) e rode docker compose up -d novamente.',
                                    },
                                    {
                                        q: '"No application encryption key" ao acessar',
                                        a: 'Execute: docker compose run --rm app php artisan key:generate e reinicie com docker compose up -d.',
                                    },
                                    {
                                        q: 'Não consigo conectar ao banco de dados',
                                        a: 'Verifique se DB_HOST, DB_USERNAME e DB_PASSWORD no .env correspondem ao serviço Postgres. No Docker Compose, DB_HOST deve ser "db".',
                                    },
                                    {
                                        q: 'Posso usar SQLite ao invés de PostgreSQL?',
                                        a: 'O Dockerfile e o Compose são configurados exclusivamente para PostgreSQL. Para desenvolvimento local sem Docker, o Laravel suporta SQLite — altere DB_CONNECTION=sqlite no .env.',
                                    },
                                    {
                                        q: 'Como fazer backup do banco?',
                                        a: 'docker compose exec db pg_dump -U saturno saturno > backup.sql',
                                    },
                                ].map(({ q, a }) => (
                                    <div
                                        key={q}
                                        className="rounded-lg border border-white/5 bg-white/[0.02] p-5"
                                    >
                                        <h3 className="mb-2 font-semibold text-white">
                                            {q}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-400">
                                            {a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CTA */}
                        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-8 text-center">
                            <h3 className="mb-2 text-xl font-bold text-white">
                                Precisa de ajuda?
                            </h3>
                            <p className="mb-4 text-slate-400">
                                Abra uma issue ou participe das discussões no
                                GitHub.
                            </p>
                            <a
                                href="https://github.com/gabrielalmir/saturno/issues"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                            >
                                <Github className="h-4 w-4" />
                                Abrir Issue
                            </a>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
