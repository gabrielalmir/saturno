/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			keyframes: {
				gradient: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				'shimmer-slide': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-50%)' },
				},
				'spin-around': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'shiny-text': {
					'0%': { backgroundPosition: 'calc(-1 * var(--shiny-width)) 0' },
					'100%': { backgroundPosition: 'calc(100% + var(--shiny-width)) 0' },
				},
				'border-beam': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				gradient: 'gradient 8s ease infinite',
				'shimmer-slide': 'shimmer-slide var(--speed, 3s) linear infinite',
				'spin-around': 'spin-around calc(var(--speed, 3s) * 0.8) linear infinite',
				'shiny-text': 'shiny-text 2.8s linear infinite',
				'border-beam': 'border-beam var(--beam-duration, 6s) linear infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
