<!-- filepath: /Users/oyeongseo/Coding/0seconds-wiki/src/routes/demos/generative-art/+page.svelte -->
<script lang="ts">
  import GenerativeArt from '$lib/components/interactive/p5/GenerativeArt.svelte';
  import { onMount } from 'svelte';
  
  // 색상 팔레트 프리셋
  const colorPresets = {
    neon: ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0000', '#0000ff'],
    pastel: ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d6875'],
    ocean: ['#03045e', '#023e8a', '#0077b6', '#0096c7', '#00b4d8', '#48cae4'],
    sunset: ['#ff7700', '#ff9500', '#ffb700', '#ffda00', '#d8f8b7'],
    monochrome: ['#fafafa', '#e0e0e0', '#9e9e9e', '#616161', '#212121']
  };
  
  // 선택된 색상 팔레트
  let selectedPalette: keyof typeof colorPresets = 'neon';
  let colorPalette = colorPresets[selectedPalette];
  
  // 화면 크기에 따른 캔버스 크기 조정
  let containerWidth = 800;
  let containerHeight = 600;
  
  // 색상 팔레트 변경 함수
  function changePalette(palette: keyof typeof colorPresets) {
    selectedPalette = palette;
    colorPalette = colorPresets[palette];
  }
  
  onMount(() => {
    const updateSize = () => {
      const container = document.querySelector('.demo-container');
      if (container) {
        containerWidth = container.clientWidth;
        containerHeight = Math.min(window.innerHeight * 0.7, 600);
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  });
</script>

<svelte:head>
  <title>생성형 아트 - 0seconds Wiki</title>
  <meta name="description" content="p5.js를 이용한 인터랙티브 생성형 아트 데모" />
</svelte:head>

<div class="demo-container">
  <h1>생성형 아트 <span class="subtitle">Generative Art</span></h1>
  
  <div class="intro">
    <p>
      생성형 아트는 알고리즘, 수학적 규칙, 또는 자연 현상에서 영감을 받은 절차로
      자동으로 생성된 예술 작품입니다. 이 페이지에서는 p5.js를 활용해 인터랙티브한
      생성형 아트의 다양한 예시를 보여드립니다.
    </p>
  </div>

  <section class="demo-section">
    <h2>인터랙티브 생성형 패턴</h2>
    
    <div class="palette-selector">
      <h3>색상 팔레트</h3>
      <div class="palette-buttons">
        {#each Object.entries(colorPresets) as [name, colors]}
          <button 
            class="palette-btn" 
            class:active={selectedPalette === name}
            on:click={() => changePalette(name as keyof typeof colorPresets)}
          >
            <div class="palette-preview">
              {#each colors as color}
                <span class="color-sample" style="background-color: {color};"></span>
              {/each}
            </div>
            <span class="palette-name">{name}</span>
          </button>
        {/each}
      </div>
    </div>
    
    <GenerativeArt 
      width={containerWidth} 
      height={containerHeight}
      {colorPalette}
    />
    
    <div class="interaction-guide">
      <h3>인터랙션 가이드</h3>
      <div class="guide-grid">
        <div class="guide-item">
          <div class="icon">🖱️</div>
          <div class="guide-text">
            <strong>마우스 클릭과 드래그:</strong> 새로운 패턴을 생성하거나 기존 패턴 변형하기
          </div>
        </div>
        <div class="guide-item">
          <div class="icon">⌨️</div>
          <div class="guide-text">
            <strong>스페이스바:</strong> 캔버스 초기화하기
          </div>
        </div>
        <div class="guide-item">
          <div class="icon">🔄</div>
          <div class="guide-text">
            <strong>패턴 변경:</strong> 위의 라디오 버튼으로 다른 알고리즘 선택하기
          </div>
        </div>
        <div class="guide-item">
          <div class="icon">🎨</div>
          <div class="guide-text">
            <strong>색상 팔레트:</strong> 다양한 색상 팔레트로 분위기 바꾸기
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="theory-section">
    <h2>생성형 아트의 원리</h2>
    
    <div class="theory-columns">
      <div class="theory-column">
        <h3>알고리즘과 예술</h3>
        <p>
          생성형 아트는 알고리즘을 통해 예술 작품을 만드는 방식입니다. 
          작가는 직접 모든 요소를 그리는 대신, 규칙과 시스템을 디자인하고 
          그 과정에서 발생하는 결과물을 예술 작품으로 활용합니다. 이러한 접근은
          복잡한 패턴을 만들고, 우연성과 결정론적 과정 사이의 균형을 탐색하는 
          새로운 방법을 제시합니다.
        </p>
        
        <h3>웹에서의 생성형 아트</h3>
        <p>
          p5.js와 같은 자바스크립트 라이브러리는 웹 브라우저에서 생성형 아트를 
          쉽게 구현할 수 있게 해줍니다. 이를 통해 정적인 이미지를 넘어 실시간으로
          변화하고, 사용자와 상호작용하는 동적인 작품을 만들 수 있습니다.
        </p>
      </div>
      
      <div class="theory-column">
        <h3>수학적 기반</h3>
        <p>
          많은 생성형 아트 알고리즘은 수학적 개념을 기반으로 합니다:
        </p>
        <ul>
          <li><strong>프랙탈(Fractals):</strong> 자기 유사성을 갖는 패턴으로, 만델브로트 집합이 대표적입니다.</li>
          <li><strong>펄린 노이즈(Perlin Noise):</strong> 자연스러운 무작위성을 만드는 알고리즘입니다.</li>
          <li><strong>L-시스템(L-systems):</strong> 재귀적 규칙을 통해 복잡한 패턴을 생성합니다.</li>
          <li><strong>셀룰러 오토마타(Cellular Automata):</strong> 간단한 규칙으로 복잡한 패턴이 발생하는 시스템입니다.</li>
        </ul>
        
        <h3>예술적 응용</h3>
        <p>
          이러한 수학적 개념과 알고리즘은 시각 예술뿐만 아니라 음악, 건축, 게임 디자인 등
          다양한 분야에서 창의적으로 활용됩니다. 생성형 아트는 기술과 예술의 경계를 
          흐리게 하고, 새로운 미적 가능성을 탐구하는 방법을 제공합니다.
        </p>
      </div>
    </div>
  </section>
  
  <section class="projects-section">
    <h2>창작 아이디어</h2>
    <p class="section-intro">
      아래 아이디어를 바탕으로 자신만의 생성형 아트 프로젝트를 시작해 보세요.
    </p>
    
    <div class="project-cards">
      <div class="project-card">
        <h3>음악 반응형 시각화</h3>
        <p>
          오디오 입력에 반응하는 생성형 패턴을 만들어보세요. 
          음악의 비트, 진폭, 주파수에 따라 시각적 요소가 변화하도록 합니다.
        </p>
      </div>
      
      <div class="project-card">
        <h3>자연 현상 시뮬레이션</h3>
        <p>
          물의 흐름, 불꽃, 구름 등 자연 현상을 알고리즘으로 시뮬레이션해보세요.
          펄린 노이즈와 입자 시스템을 활용하면 놀라운 결과물을 얻을 수 있습니다.
        </p>
      </div>
      
      <div class="project-card">
        <h3>데이터 시각화 아트</h3>
        <p>
          실제 데이터(날씨, 주식 시장, 소셜 미디어 활동 등)를 예술적으로 
          시각화하는 프로젝트를 만들어보세요. 데이터의 패턴이 아름다운 시각적 형태로 변환됩니다.
        </p>
      </div>
    </div>
  </section>
</div>

<style>
  .demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #ff0080;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .subtitle {
    font-size: 1.8rem;
    opacity: 0.6;
    font-weight: 300;
  }
  
  h2 {
    font-size: 1.8rem;
    margin: 2rem 0 1rem;
    color: #00ffff;
    border-bottom: 2px solid rgba(0, 255, 255, 0.3);
    padding-bottom: 0.5rem;
  }
  
  h3 {
    font-size: 1.4rem;
    margin: 1.5rem 0 0.75rem;
    color: #ffff00;
  }
  
  .intro {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    color: #e9e9e9;
  }
  
  .demo-section {
    margin-bottom: 3rem;
  }
  
  .palette-selector {
    margin-bottom: 1.5rem;
  }
  
  .palette-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .palette-btn {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .palette-btn:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .palette-btn.active {
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
  
  .palette-preview {
    display: flex;
    gap: 2px;
    margin-bottom: 0.5rem;
  }
  
  .color-sample {
    width: 1rem;
    height: 1rem;
    border-radius: 2px;
  }
  
  .palette-name {
    font-size: 0.8rem;
    color: #ccc;
    text-transform: capitalize;
  }
  
  .interaction-guide {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 2rem;
  }
  
  .guide-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .guide-item {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .icon {
    font-size: 2rem;
  }
  
  .guide-text {
    font-size: 0.9rem;
    color: #ccc;
    line-height: 1.5;
  }
  
  .guide-text strong {
    color: #00ffff;
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .theory-section {
    margin-bottom: 3rem;
  }
  
  .theory-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .theory-column p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
    color: #bbb;
  }
  
  .theory-column ul {
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .theory-column li {
    margin-bottom: 0.5rem;
    color: #bbb;
    line-height: 1.5;
  }
  
  .projects-section {
    margin-bottom: 3rem;
  }
  
  .section-intro {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: #ccc;
  }
  
  .project-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .project-card {
    background: linear-gradient(to bottom right, rgba(255, 0, 128, 0.1), rgba(0, 255, 255, 0.1));
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .project-card h3 {
    margin-top: 0;
  }
  
  .project-card p {
    color: #ccc;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    .theory-columns {
      grid-template-columns: 1fr;
    }
    
    .palette-buttons {
      justify-content: center;
    }
  }
</style>
