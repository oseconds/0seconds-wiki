<script lang="ts">
	// 최신 추가된 콘텐츠를 위한 더미 데이터
	const recentArticles = [
		{
			title: 'ADSR 엔벨로프 이해하기',
			slug: '/synth/adsr',
			summary: '소리의 형태를 결정하는 기본 요소 ADSR 엔벨로프에 대해 알아보세요.',
			date: '2025-04-15'
		},
		{
			title: '이퀄라이저 효과적으로 사용하기',
			slug: '/effects/eq',
			summary: '음향 작업에서 가장 기본이 되는 이퀄라이저 사용법을 알아봅니다.',
			date: '2025-04-10'
		},
		{
			title: 'DAW별 비교 분석',
			slug: '/daw/comparison',
			summary: '다양한 DAW 소프트웨어의 장단점을 비교해봅니다.',
			date: '2025-04-05'
		}
	];

	// 인기 있는 인터랙티브 데모
	const popularDemos = [
		{
			title: 'ADSR 직접 조절해보기',
			slug: '/demos/adsr',
			thumbnail: '/images/adsr-demo.jpg',
			description: '다양한 ADSR 설정을 직접 조절하며 소리의 변화를 경험해보세요.'
		},
		{
			title: '사운드 시각화',
			slug: '/demos/sound-visualizer',
			thumbnail: '/images/sound-visualizer-demo.jpg',
			description: '실시간 오디오 파형과 주파수 스펙트럼을 시각적으로 확인해보세요.'
		},
		{
			title: '생성형 아트',
			slug: '/demos/generative-art',
			thumbnail: '/images/generative-art-demo.jpg',
			description: 'p5.js를 활용한 인터랙티브 미디어 아트를 경험해보세요.'
		},
		{
			title: '코드 진행 실험실',
			slug: '/demos/chord-progression',
			thumbnail: '/images/chord-demo.jpg',
			description: '다양한 코드 진행을 시도하고 그 효과를 비교해보세요.'
		}
	];
</script>

<svelte:head>
	<title>0seconds Wiki - 전자음악과 음향에 관한 모든 것</title>
	<meta name="description" content="전자음악, 음향 지식, DAW 튜토리얼을 인터랙티브하게 배워보세요." />
</svelte:head>

<section class="hero">
	<div class="hero-content">
		<h1>전자음악과 음향 지식의 모든 것</h1>
		<p>
			인터랙티브한 예제와 함께 <strong>전자음악</strong>과 <strong>음향</strong>에 관한 지식을 쉽고 재미있게
			배워보세요.
		</p>
		<div class="hero-buttons">
			<a href="/basics" class="btn-primary">시작하기</a>
			<a href="/about" class="btn-secondary">위키 소개</a>
		</div>
	</div>
</section>

<section class="features">
	<div class="feature-card">
		<div class="icon">🎵</div>
		<h3>음악 이론</h3>
		<p>화성학, 리듬, 멜로디와 같은 음악의 기초부터 고급 이론까지</p>
	</div>
	<div class="feature-card">
		<div class="icon">🎚️</div>
		<h3>음향 프로세싱</h3>
		<p>컴프레서, 이퀄라이저, 디스토션 등 음향 효과의 원리와 활용법</p>
	</div>
	<div class="feature-card">
		<div class="icon">🎹</div>
		<h3>신디사이저</h3>
		<p>아날로그, 디지털, 모듈러 신디사이저의 작동 원리와 사용법</p>
	</div>
	<div class="feature-card">
		<div class="icon">🔊</div>
		<h3>인터랙티브 학습</h3>
		<p>직접 소리를 듣고 파라미터를 조절하며 실시간으로 변화를 체험</p>
	</div>
</section>

<section class="recent-articles">
	<h2>최신 콘텐츠</h2>
	<div class="article-grid">
		{#each recentArticles as article}
			<div class="article-card">
				<h3><a href={article.slug}>{article.title}</a></h3>
				<p class="date">{article.date}</p>
				<p>{article.summary}</p>
				<a href={article.slug} class="read-more">자세히 보기 →</a>
			</div>
		{/each}
	</div>
</section>

<section class="interactive-demos">
	<h2>인터랙티브 데모</h2>
	<div class="demo-grid">
		{#each popularDemos as demo}
			<div class="demo-card">
				<div class="demo-thumbnail">
					<!-- 이미지는 나중에 추가 예정 -->
					<div class="placeholder-image">{demo.title[0]}</div>
				</div>
				<div class="demo-content">
					<h3><a href={demo.slug}>{demo.title}</a></h3>
					<p>{demo.description}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.hero {
		padding: 4rem 0;
		text-align: center;
		background: linear-gradient(135deg, #1a1a2e, #16213e);
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.hero h1 {
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
		color: #fff;
	}

	.hero p {
		font-size: 1.2rem;
		color: #ccc;
		max-width: 700px;
		margin: 0 auto 2rem;
	}

	.hero-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s;
	}

	.btn-primary {
		background-color: #5b8fb9;
		color: #fff;
	}

	.btn-primary:hover {
		background-color: #4a759a;
	}

	.btn-secondary {
		background-color: transparent;
		color: #fff;
		border: 1px solid #ccc;
	}

	.btn-secondary:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.feature-card {
		background: #1a1a1a;
		padding: 1.5rem;
		border-radius: 8px;
		text-align: center;
		transition: transform 0.2s;
	}

	.feature-card:hover {
		transform: translateY(-5px);
	}

	.icon {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		margin: 0 0 1rem;
		color: #fff;
	}

	.feature-card p {
		color: #ccc;
		font-size: 0.9rem;
	}

	.recent-articles,
	.interactive-demos {
		margin-bottom: 3rem;
	}

	h2 {
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
		color: #fff;
		position: relative;
	}

	h2::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -0.5rem;
		width: 60px;
		height: 3px;
		background: #5b8fb9;
	}

	.article-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.article-card {
		background: #1a1a1a;
		padding: 1.5rem;
		border-radius: 8px;
		transition: transform 0.2s;
	}

	.article-card:hover {
		transform: translateY(-5px);
	}

	.article-card h3 {
		margin: 0 0 0.5rem;
	}

	.article-card h3 a {
		color: #fff;
		text-decoration: none;
	}

	.article-card h3 a:hover {
		color: #5b8fb9;
	}

	.date {
		font-size: 0.8rem;
		color: #888;
		margin-bottom: 1rem;
	}

	.read-more {
		display: inline-block;
		margin-top: 1rem;
		font-size: 0.9rem;
		color: #5b8fb9;
		text-decoration: none;
	}

	.demo-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.demo-card {
		background: #1a1a1a;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.demo-thumbnail {
		height: 180px;
		background-color: #16213e;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder-image {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #5b8fb9;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		color: #fff;
		font-weight: bold;
	}

	.demo-content {
		padding: 1.5rem;
	}

	.demo-content h3 {
		margin: 0 0 0.8rem;
	}

	.demo-content h3 a {
		color: #fff;
		text-decoration: none;
	}

	.demo-content h3 a:hover {
		color: #5b8fb9;
	}

	@media (max-width: 768px) {
		.article-grid,
		.demo-grid {
			grid-template-columns: 1fr;
		}

		.features {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}
</style>
