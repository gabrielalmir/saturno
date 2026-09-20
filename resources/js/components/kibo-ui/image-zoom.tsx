import type { ImgHTMLAttributes, ReactNode } from 'react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'children'> & {
    containerClassName?: string;
    caption?: ReactNode;
};

export function ImageZoom({
    containerClassName,
    className,
    caption,
    alt,
    ...props
}: Props) {
    const [open, setOpen] = useState(false);
    const titleId = useId();

    return (
        <>
            <button
                type="button"
                className={cn(
                    'group relative block overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left',
                    containerClassName,
                )}
                onClick={() => setOpen(true)}
            >
                <img
                    alt={alt}
                    className={cn(
                        'h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]',
                        className,
                    )}
                    {...props}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/8 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0D13]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                            <div
                                id={titleId}
                                className="truncate text-sm font-medium text-slate-200"
                            >
                                {alt ?? 'Imagem'}
                            </div>
                            <button
                                type="button"
                                className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
                                onClick={() => setOpen(false)}
                            >
                                Fechar
                            </button>
                        </div>
                        <div className="bg-black">
                            <img
                                alt={alt}
                                className="max-h-[80vh] w-full object-contain"
                                {...props}
                            />
                        </div>
                        {caption && (
                            <div className="border-t border-white/10 px-4 py-3 text-xs text-slate-400">
                                {caption}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

