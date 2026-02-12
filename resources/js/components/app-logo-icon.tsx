import type { SVGProps } from 'react';

type SaturnoIconProps = SVGProps<SVGSVGElement> & {
    size?: number;
    primary?: string;
    accent?: string;
    cutout?: string;
};

export function SaturnoIcon({
    size = 24,
    primary = 'currentColor',
    accent = 'var(--accent)',
    cutout = 'var(--background)',
    ...props
}: SaturnoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 256 256"
            fill="none"
            role="img"
            aria-label="Saturno"
            {...props}
        >
            <ellipse
                cx="128"
                cy="128"
                rx="74"
                ry="74"
                stroke={primary}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
            />

            <g transform="rotate(-18 128 128)">
                <ellipse
                    cx="128"
                    cy="132"
                    rx="118"
                    ry="44"
                    stroke={primary}
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>

            <g transform="rotate(-18 128 128)">
                <path
                    d="M 26 132 C 64 92, 192 92, 230 132"
                    stroke={cutout}
                    strokeWidth="26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.95"
                />
            </g>

            <path
                d="M 92 188 A 74 74 0 0 0 132 202"
                stroke={accent}
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.9"
            />

            <circle cx="78" cy="92" r="12" fill={primary} />
            <circle cx="176" cy="112" r="14" fill={accent} opacity="0.95" />
            <circle cx="140" cy="182" r="12" fill={accent} opacity="0.75" />
        </svg>
    );
}

export default function AppLogoIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <SaturnoIcon size={32} primary="currentColor" accent="var(--accent)" {...props} />
    );
}
