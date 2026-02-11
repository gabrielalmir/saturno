import { Link } from '@inertiajs/react';
import { Github, Heart, Star } from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Button } from '@/components/ui/button';

export default function CTA() {
    return (
        <section
            id="cta"
            className="relative overflow-hidden px-6 py-32 text-center"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-indigo-600/5" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-3xl space-y-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
                    <Heart className="h-4 w-4" />
                    100% Open Source • MIT License
                </div>

                <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                    Faça parte da comunidade
                </h2>
                <p className="text-xl text-slate-400">
                    Saturno é open source e gratuito para sempre. Contribua,
                    customize e self-host sem limitações.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <ShimmerButton
                        asChild
                        className="h-14 px-8 text-lg text-black"
                        background="#ffffff"
                        shimmerColor="#111827"
                        shimmerDuration="3s"
                    >
                        <a
                            href="https://github.com/gabrielalmir/saturno"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center"
                        >
                            <Github className="mr-2 h-5 w-5" />
                            Ver no GitHub
                        </a>
                    </ShimmerButton>

                    <Link href="/docs">
                        <Button
                            size="lg"
                            variant="ghost"
                            className="h-14 rounded-full px-8 text-lg text-slate-400 hover:bg-white/5 hover:text-white"
                        >
                            <Star className="mr-2 h-5 w-5" />
                            Começar self-hosting
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
