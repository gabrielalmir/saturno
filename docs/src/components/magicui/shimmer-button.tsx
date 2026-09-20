import type {
	ComponentPropsWithoutRef,
	CSSProperties,
	ReactElement,
	ReactNode,
} from 'react';
import { Children, cloneElement, isValidElement } from 'react';

import { cn } from '@/lib/utils';

export type ShimmerButtonProps = ComponentPropsWithoutRef<'button'> & {
	asChild?: boolean;
	shimmerColor?: string;
	shimmerSize?: string;
	borderRadius?: string;
	shimmerDuration?: string;
	background?: string;
};

export function ShimmerButton({
	asChild = false,
	shimmerColor = '#ffffff',
	shimmerSize = '0.05em',
	shimmerDuration = '3s',
	borderRadius = '100px',
	background = 'rgba(0, 0, 0, 1)',
	className,
	children,
	...props
}: ShimmerButtonProps) {
	const vars = {
		'--spread': '90deg',
		'--shimmer-color': shimmerColor,
		'--radius': borderRadius,
		'--speed': shimmerDuration,
		'--cut': shimmerSize,
		'--bg': background,
	} as CSSProperties;

	const sparkLayers = (
		<>
			<div className="-z-30 blur-[2px] [container-type:size] absolute inset-0 overflow-visible">
				<div className="animate-shimmer-slide absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]">
					<div className="animate-spin-around absolute -inset-full w-auto rotate-0 [translate:0_0] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
				</div>
			</div>
			<div
				className={cn(
					'absolute inset-0 size-full rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',
					'transform-gpu transition-all duration-300 ease-in-out',
					'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
					'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]'
				)}
			/>
			<div className="absolute [inset:var(--cut)] -z-20 rounded-[var(--radius)] [background:var(--bg)]" />
		</>
	);

	const baseClassName = cn(
		'group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-[var(--radius)] border border-white/10 px-6 py-3 text-white [background:var(--bg)]',
		'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
		className
	);

	if (asChild) {
		const onlyChild = Children.only(children);
		if (!isValidElement(onlyChild)) {
			throw new Error(
				'ShimmerButton with asChild expects a single React element child.'
			);
		}

		const child = onlyChild as ReactElement<{
			className?: string;
			style?: CSSProperties;
			children?: ReactNode;
		}>;

		const childProps = child.props as {
			className?: string;
			style?: CSSProperties;
		};

		const childContent = child.props.children;

		return cloneElement(child, {
			...props,
			className: cn(baseClassName, childProps.className),
			style: {
				...(childProps.style ?? {}),
				...vars,
				...(props.style ?? {}),
			},
			children: (
				<>
					{sparkLayers}
					{childContent}
				</>
			),
		});
	}

	return (
		<button style={vars} className={baseClassName} type="button" {...props}>
			{sparkLayers}
			{children}
		</button>
	);
}
