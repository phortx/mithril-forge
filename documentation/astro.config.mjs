// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeSix from '@six-tech/starlight-theme-six';

// https://astro.build/config
export default defineConfig({
	base: '/documentation',
	integrations: [
		starlight({
			title: 'Mithril Forge',
			favicon: '/favicon.svg',
			logo: {
				src: './public/logo.svg',
				replacesTitle: false,
			},
			credits: false,
			customCss: ['./src/styles/theme.css', './src/styles/icons.css', './src/styles/homepage.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/phortx/mithril-forge' }],
			sidebar: [
				{
					label: 'User Manual',
					items: [{ autogenerate: { directory: 'user-manual' } }]
				},
				{
					label: 'Technical Documentation',
					items: [{ autogenerate: { directory: 'technical-docs' } }]
				},
			],
			plugins: [
				starlightThemeSix({
					navLinks: [
						{
							label: 'Home',
							link: '/',
							attrs: { 'data-icon': 'home' }
						},
						{
							label: 'Manual',
							link: '/user-manual/',
							attrs: { 'data-icon': 'manual' }
						},
						{
							label: 'Docs',
							link: '/technical-docs/',
							attrs: { 'data-icon': 'tech' }
						},
						{
							label: 'Feedback',
							link: 'https://github.com/phortx/mithril-forge/issues',
							attrs: { 'data-icon': 'issues' }
						},
						{
							label: 'Roadmap',
							link: 'https://github.com/phortx/mithril-forge/milestones',
							attrs: { 'data-icon': 'roadmap' }
						},
						{
							label: 'Forum',
							link: 'https://github.com/phortx/mithril-forge/discussions',
							attrs: { 'data-icon': 'forum' }
						}
					]
				})
			],
		}),
	],
});
