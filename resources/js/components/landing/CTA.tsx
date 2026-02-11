import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

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
                <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                    Pronto para decolar?
                </h2>
                <p className="text-xl text-slate-400">
                    Junte-se às equipes de alta velocidade que já migraram para
                    a velocidade de dobra.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <ShimmerButton
                        asChild
                        className="h-14 px-8 text-lg text-black"
                        background="#ffffff"
                        shimmerColor="#111827"
                        shimmerDuration="3s"
                    >
                        <Link href={register()} className="inline-flex items-center">
                            Começar a acompanhar{' '}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </ShimmerButton>

                    <Link href="/contato">
                        <Button
                            size="lg"
                            variant="ghost"
                            className="h-14 rounded-full px-8 text-lg text-slate-400 hover:bg-white/5 hover:text-white"
                        >
                            Falar com Vendas
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
