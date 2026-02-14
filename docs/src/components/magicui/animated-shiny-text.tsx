import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

import { cn } from '@/lib/utils';

export type AnimatedShinyTextProps = ComponentPropsWithoutRef<'span'> & {
	shimmerWidth?: number;
};

export function AnimatedShinyText({
	children,
	className,
	shimmerWidth = 100,
	...props
}: AnimatedShinyTextProps) {
	return (
		<span
			style={
				{
					'--shiny-width': `${shimmerWidth}px`,
				} as CSSProperties
			}
			className={cn(
				'animate-shiny-text bg-gradient-to-r from-transparent via-white/80 via-50% to-transparent bg-[length:var(--shiny-width)_100%] bg-clip-text bg-no-repeat text-slate-400',
				className
			)}
			{...props}
		>
			{children}
		</span>
	);
}
