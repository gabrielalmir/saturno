import { Head, Link, usePage } from "@inertiajs/react";
import AppLogo from "@/components/app-logo";
import Comparison from "@/components/landing/Comparison";
import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import ManifestoSection from "@/components/landing/ManifestoSection";
import Stats from "@/components/landing/Stats";
import { Button } from "@/components/ui/button";
import { dashboard, login, register } from "@/routes";
import type { SharedData } from "@/types";

export default function Welcome({
  canRegister = true,
}: {
  canRegister?: boolean;
}) {
  const { auth } = usePage<SharedData>().props;

  return (
    <div className="min-h-screen bg-[#0B0D13] font-sans text-slate-200 selection:bg-indigo-500/30">
      <Head title="Saturno OSS | Plataforma open-source para equipes de engenharia" />

      {/* Background Effects */}
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Radial Gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#0B0D13_0%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 opacity-40 blur-[128px]" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-600/10 opacity-40 blur-[128px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0D13]/50 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <AppLogo />
            </div>
            <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
              <a
                href="#features"
                className="transition-colors hover:text-white"
              >
                Recursos
              </a>
              <a
                href="#comparison"
                className="transition-colors hover:text-white"
              >
                Comparacao
              </a>
              <a
                href="#manifesto"
                className="transition-colors hover:text-white"
              >
                Manifesto
              </a>
              <a href="#cta" className="transition-colors hover:text-white">
                Comecar
              </a>
            </div>
            <div className="flex items-center gap-4">
              {auth.user ? (
                <Link href={dashboard()}>
                  <Button
                    size="sm"
                    className="border-0 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={login()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                      Entrar
                    </Button>
                  </Link>
                  {canRegister && (
                    <Link href={register()}>
                      <Button
                        size="sm"
                        className="border-0 bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-700"
                      >
                        Começar agora
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Hero />
          <Stats />
          <Features />
          <Comparison />
          <ManifestoSection />
          <CTA />
        </main>

        <Footer />
      </div>
    </div>
  );
}
