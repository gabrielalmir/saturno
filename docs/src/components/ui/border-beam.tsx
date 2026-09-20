interface BorderBeamProps {
	size?: number;
	duration?: number;
	delay?: number;
	colorFrom?: string;
	colorTo?: string;
	reverse?: boolean;
	initialOffset?: number;
	borderWidth?: number;
}

export const BorderBeam = ({
	delay = 0,
	duration = 6,
	colorFrom = '#ffaa40',
	colorTo = '#9c40ff',
	reverse = false,
}: BorderBeamProps) => {
	return (
		<div
			className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
			aria-hidden
		>
			<div
				className="absolute inset-[-100%] animate-border-beam"
				style={
					{
						'--beam-duration': `${duration}s`,
						animationDelay: `${-delay}s`,
						animationDirection: reverse ? 'reverse' : 'normal',
						background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${colorFrom} 15deg, ${colorTo} 45deg, transparent 60deg)`,
					} as React.CSSProperties
				}
			/>
		</div>
	);
};
