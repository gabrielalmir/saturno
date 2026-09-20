import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = ComponentPropsWithoutRef<'div'> & {
    reverse?: boolean;
    pauseOnHover?: boolean;
    children: ReactNode;
    vertical?: boolean;
    repeat?: number;
};

export function Marquee({
    className,
    reverse = false,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4,
    ...props
}: Props) {
    return (
        <div
            {...props}
            className={cn(
                'group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
                vertical ? 'flex-col' : 'flex-row',
                className,
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                         
                        key={i}
                        className={cn(
                            'flex shrink-0 justify-around [gap:var(--gap)]',
                            vertical
                                ? 'animate-marquee-vertical flex-col'
                                : 'animate-marquee flex-row',
                            pauseOnHover &&
                                'group-hover:[animation-play-state:paused]',
                            reverse && '[animation-direction:reverse]',
                        )}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}

