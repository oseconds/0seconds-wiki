import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { 
		adapter: adapter({
			// GitHub Pages에서 사용할 경로
			fallback: '404.html',
			// 빌드 폴더 설정
			pages: 'build',
			assets: 'build',
			// precompress 옵션 비활성화
			precompress: false
		}),
		// GitHub Pages에서 사용할 baseURL 설정
		paths: {
			// GitHub 저장소 이름으로 변경하세요
			base: '/0seconds-wiki'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
