import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    optimizeDeps: {
        include: ['p5']
    },
    resolve: {
        alias: {
            // p5.js를 위한 특별 처리
            'p5': 'p5/lib/p5.min.js'
        }
    },
    build: {
        commonjsOptions: {
            include: [/p5/, /node_modules/]
        }
    }
});
