<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();

	// 사이드바 메뉴 항목
	const categories = [
		{ title: '기초 이론', path: '/basics' },
		{ title: 'DAW 지식', path: '/daw' },
		{ title: '음향 효과', path: '/effects' },
		{ title: '신디사이저', path: '/synth' },
		{ title: '음악 제작 팁', path: '/production' }
	];
</script>

<div class="app">
	<header>
		<div class="header-content">
			<div class="logo">
				<a href="/">0seconds Wiki</a>
				<span class="subtitle">전자음악과 음향에 관한 모든 것</span>
			</div>
			<nav>
				<ul>
					<li class:active={$page.url.pathname === '/'}>
						<a href="/">홈</a>
					</li>
					<li class:active={$page.url.pathname.startsWith('/about')}>
						<a href="/about">소개</a>
					</li>
					<li class:active={$page.url.pathname.startsWith('/contact')}>
						<a href="/contact">연락처</a>
					</li>
				</ul>
			</nav>
		</div>
	</header>

	<div class="content-wrapper">
		<aside class="sidebar">
			<div class="sidebar-content">
				<h3>카테고리</h3>
				<ul>
					{#each categories as category}
						<li class:active={$page.url.pathname.startsWith(category.path)}>
							<a href={category.path}>{category.title}</a>
						</li>
					{/each}
				</ul>
			</div>
		</aside>

		<main>
			{@render children()}
		</main>
	</div>

	<footer>
		<div class="footer-content">
			<p>© {new Date().getFullYear()} 0seconds Wiki - 전자음악과 음향에 관한 지식 공유 플랫폼</p>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		background-color: #1a1a1a;
		border-bottom: 1px solid #333;
		padding: 0.5rem 1rem;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		display: flex;
		flex-direction: column;
	}

	.logo a {
		color: #fff;
		font-size: 1.5rem;
		font-weight: bold;
		text-decoration: none;
	}

	.subtitle {
		font-size: 0.8rem;
		color: #888;
	}

	nav ul {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	nav a {
		color: #ccc;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 0;
		transition: color 0.2s;
	}

	nav a:hover {
		color: #fff;
	}

	nav li.active a {
		color: #fff;
		border-bottom: 2px solid #5b8fb9;
	}

	.content-wrapper {
		display: flex;
		flex: 1;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		padding: 1rem;
	}

	.sidebar {
		width: 250px;
		margin-right: 2rem;
	}

	.sidebar-content {
		position: sticky;
		top: 5rem;
	}

	.sidebar h3 {
		margin-top: 0;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #333;
	}

	.sidebar ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.sidebar li {
		margin-bottom: 0.5rem;
	}

	.sidebar a {
		color: #ccc;
		text-decoration: none;
		display: block;
		padding: 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s, color 0.2s;
	}

	.sidebar li.active a {
		background-color: rgba(91, 143, 185, 0.2);
		color: #5b8fb9;
	}

	.sidebar a:hover {
		background-color: rgba(255, 255, 255, 0.05);
		color: #fff;
	}

	main {
		flex: 1;
		min-width: 0;
	}

	footer {
		background-color: #1a1a1a;
		border-top: 1px solid #333;
		padding: 1rem;
		margin-top: 2rem;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		text-align: center;
		color: #888;
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.content-wrapper {
			flex-direction: column;
		}

		.sidebar {
			width: 100%;
			margin-right: 0;
			margin-bottom: 2rem;
		}

		.sidebar-content {
			position: static;
		}
	}
</style>
