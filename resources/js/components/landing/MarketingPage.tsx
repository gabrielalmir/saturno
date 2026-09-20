import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

type Props = {
    title: string;
    children: ReactNode;
};

export function MarketingPage({ title, children }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-[#0B0D13] font-sans text-slate-200 selection:bg-indigo-500/30">
            <Head title={title} />

            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#0B0D13_0%,transparent_100%)]" />
                <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 opacity-40 blur-[128px]" />
                <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-600/10 opacity-40 blur-[128px]" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col">
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
                                        Comecar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
                    <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                        {title}
                    </h1>
                    <div className="mt-8 space-y-4 text-slate-300">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
