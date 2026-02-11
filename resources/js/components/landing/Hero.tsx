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
                <div className="mb-4 inline-flex animate-in items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 duration-700 fade-in slide-in-from-bottom-4">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    🎉 Open Source & Grátis
                </div>

                {/* Headline */}
                <h1 className="font-display mb-6 animate-in text-5xl font-bold tracking-tight text-white delay-100 duration-700 fade-in slide-in-from-bottom-8 md:text-7xl">
                    Sprint management{' '}
                    <AnimatedGradientText
                        className="font-display"
                        speed={1.2}
                        colorFrom="#60a5fa"
                        colorTo="#a78bfa"
                    >
                        open source
                    </AnimatedGradientText>
                    <br />
                    para times ágeis
                </h1>

                {/* Subheadline */}
                <p className="mx-auto max-w-2xl animate-in text-lg leading-relaxed text-slate-400 delay-200 duration-700 fade-in slide-in-from-bottom-8 md:text-xl">
                    100% open source, self-hosted e sem vendor lock-in. <br />
                    Planeje sprints, gerencie capacidade e entregue com
                    visibilidade total.
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
                        <a
                            href="https://github.com/gabrielalmir/saturno"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center"
                        >
                            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Star on GitHub
                        </a>
                    </ShimmerButton>

                    <Link href={auth.user ? dashboard() : '/docs'}>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 rounded-full border-white/10 bg-white/5 px-8 text-base text-slate-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:text-white"
                        >
                            {auth.user ? 'Ir para o Dashboard' : 'Ver Documentação'}
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
