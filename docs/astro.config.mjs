// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import starlight from '@astrojs/starlight';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		tailwind(),
		starlight({
			title: 'Saturno',
			customCss: ['./src/styles/starlight-landing.css'],
			components: {
				SiteTitle: './src/components/starlight/SiteTitle.astro',
				ThemeSelect: './src/components/starlight/ThemeSelect.astro',
				Footer: './src/components/starlight/Footer.astro',
			},
			head: [
				{
					tag: 'script',
					content:
						"if (typeof localStorage !== 'undefined' && !localStorage.getItem('starlight-theme')) localStorage.setItem('starlight-theme','dark');",
				},
			],
			credits: false,
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/gabrielalmir/saturno' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introdução', slug: 'docs/getting-started/introduction' },
						{ label: 'Quick Start', slug: 'docs/getting-started/quick-start' },
						{ label: 'Instalação', slug: 'docs/getting-started/installation' },
						{ label: 'Configuração', slug: 'docs/getting-started/configuration' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Primeiro Projeto', slug: 'docs/guides/first-project' },
						{ label: 'Criando Work Items', slug: 'docs/guides/creating-work-items' },
						{ label: 'Planejamento de Sprints', slug: 'docs/guides/planning-sprints' },
						{ label: 'Kanban Board', slug: 'docs/guides/kanban-board' },
						{ label: 'Calendário', slug: 'docs/guides/calendar' },
						{ label: 'Épicos', slug: 'docs/guides/epics' },
					],
				},
				{
					label: 'Self Hosting',
					items: [
						{ label: 'Requisitos', slug: 'docs/self-hosting/requirements' },
						{ label: 'Banco de Dados', slug: 'docs/self-hosting/database' },
						{ label: 'Rodando Localmente', slug: 'docs/self-hosting/running-locally' },
						{ label: 'Deploy em Produção', slug: 'docs/self-hosting/production-deploy' },
						{ label: 'Docker', slug: 'docs/self-hosting/docker' },
					],
				},
				{
					label: 'Integrations',
					items: [
						{ label: 'E-mail', slug: 'docs/integrations/email' },
						{ label: 'Webhooks', slug: 'docs/integrations/webhooks' },
						{ label: 'Autenticação da API', slug: 'docs/integrations/api-authentication' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'API', slug: 'docs/reference/api' },
						{ label: 'Variáveis de Ambiente', slug: 'docs/reference/environment-variables' },
						{ label: 'Permissões', slug: 'docs/reference/permissions' },
					],
				},
				{
					label: 'Contributing',
					items: [
						{ label: 'Desenvolvimento', slug: 'docs/contributing/development' },
						{ label: 'Arquitetura', slug: 'docs/contributing/architecture' },
						{ label: 'Testes', slug: 'docs/contributing/testing' },
					],
				},
			],
		}),
	],
	vite: {
		resolve: {
			alias: {
				'@': path.join(__dirname, 'src'),
			},
		},
	},
});
