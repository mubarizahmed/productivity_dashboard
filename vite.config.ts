import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		dedupe: ['@fullcalendar/common']
	},
	optimizeDeps: {
		include: ['@fullcalendar/common']
	}
});
