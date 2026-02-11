import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useState, useRef } from 'react';
import { ImageZoom } from '@/components/kibo-ui/image-zoom';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Button } from '@/components/ui/button';
import { dashboard, register } from '@/routes';
import type { SharedData } from '@/types';

export default function Hero() {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const { auth } = usePage<SharedData>().props;

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (mouseY / (rect.height / 2)) * -5; // Max -5 deg
        const rotateY = (mouseX / (rect.width / 2)) * 5; // Max 5 deg

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <section
            id="top"
            className="relative overflow-hidden px-6 pt-32 pb-20 text-center"
        >
            <div className="relative z-10 mx-auto max-w-4xl space-y-8">
                {/* Badge */}
                <div className="mb-4 inline-flex animate-in items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 duration-700 fade-in slide-in-from-bottom-4">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                    </span>
                    v1.0 disponível
                </div>

                {/* Headline */}
                {/* Headline */}
                <h1 className="font-display mb-6 animate-in text-5xl font-bold tracking-tight text-white delay-100 duration-700 fade-in slide-in-from-bottom-8 md:text-7xl">
                    Gestão de engenharia em <br />
                    <AnimatedGradientText
                        className="font-display"
                        speed={1.2}
                        colorFrom="#60a5fa"
                        colorTo="#a78bfa"
                    >
                        velocidade de dobra
                    </AnimatedGradientText>
                </h1>

                {/* Subheadline */}
                <p className="mx-auto max-w-2xl animate-in text-lg leading-relaxed text-slate-400 delay-200 duration-700 fade-in slide-in-from-bottom-8 md:text-xl">
                    Pare de brigar com o Jira. Comece a entregar. <br />O
                    gerenciador de sprints projetado para a nova era do
                    desenvolvimento de software.
                </p>

                {/* CTA Buttons */}
                <div className="flex animate-in flex-col items-center justify-center gap-4 pt-4 delay-300 duration-700 fade-in slide-in-from-bottom-8 sm:flex-row">
                    <ShimmerButton
                        asChild
                        className="h-12 px-8 text-base"
                        background="rgba(79,70,229,0.9)"
                        shimmerColor="#ffffff"
                        shimmerDuration="2.6s"
                    >
                        <Link href={auth.user ? dashboard() : register()}>
                            {auth.user ? 'Ir para o painel' : 'Iniciar missao'}{' '}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </ShimmerButton>

                    <Link href="/manifesto">
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 rounded-full border-white/10 bg-white/5 px-8 text-base text-slate-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:text-white"
                        >
                            Ler manifesto
                        </Button>
                    </Link>
                </div>

                {/* Dashboard Tilt Preview */}
                <div
                    className="perspective-1000 relative mt-20"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={containerRef}
                >
                    <div
                        className="relative rounded-xl border border-white/10 bg-[#0B0D13] shadow-2xl transition-transform duration-200 ease-out"
                        style={{
                            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                        }}
                    >
                        {/* Glow behind */}
                        <div className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur transition duration-1000 group-hover:opacity-40"></div>

                        {/* Image */}
                        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-slate-900">
                            <ImageZoom
                                src="/images/dashboard-mockup.png"
                                alt="Interface do Dashboard do Saturno"
                                containerClassName="h-full w-full rounded-xl border-0 bg-transparent"
                                className="h-full w-full rounded-xl object-cover opacity-90 transition-opacity hover:opacity-100"
                            />
                        </div>

                        {/* Reflection Gradient */}
                        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/5 to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
