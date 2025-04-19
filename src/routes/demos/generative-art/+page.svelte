<script lang="ts">
  import GenerativeArt from '$lib/components/interactive/p5/GenerativeArt.svelte';

  // 제어 가능한 파라미터
  let particleCount = 100;
  let particleSpeed = 2;
  let particleSize = 5;
  let colorMode = 'rainbow';
  let backgroundColor = '#121212';
  let lineOpacity = 0.2;
  let noiseScale = 0.01;
  let noiseStrength = 1;
  
  // 프리셋 설정
  const presets = {
    calm: {
      particleCount: 80,
      particleSpeed: 1,
      particleSize: 4,
      colorMode: 'monochrome',
      backgroundColor: '#0a192f',
      lineOpacity: 0.15,
      noiseScale: 0.005,
      noiseStrength: 0.7
    },
    energetic: {
      particleCount: 150,
      particleSpeed: 3,
      particleSize: 6,
      colorMode: 'rainbow',
      backgroundColor: '#000000',
      lineOpacity: 0.25,
      noiseScale: 0.02,
      noiseStrength: 1.5
    },
    minimal: {
      particleCount: 50,
      particleSpeed: 1.5,
      particleSize: 3,
      colorMode: 'custom',
      backgroundColor: '#ffffff',
      lineOpacity: 0.1,
      noiseScale: 0.008,
      noiseStrength: 0.5
    }
  };
  
  // 프리셋 적용 함수
  function applyPreset(preset: string) {
    const settings = presets[preset as keyof typeof presets];
    if (settings) {
      particleCount = settings.particleCount;
      particleSpeed = settings.particleSpeed;
      particleSize = settings.particleSize;
      colorMode = settings.colorMode;
      backgroundColor = settings.backgroundColor;
      lineOpacity = settings.lineOpacity;
      noiseScale = settings.noiseScale;
      noiseStrength = settings.noiseStrength;
    }
  }
  
  // 커스텀 색상 설정
  let customColors = ['#FF5722', '#03A9F4', '#4CAF50', '#FFC107', '#9C27B0'];
</script>

<svelte:head>
  <title>제너레이티브 아트 | 0seconds Wiki</title>
  <meta name="description" content="p5.js를 활용한 인터랙티브 제너레이티브 아트를 경험해보세요." />
</svelte:head>

<div class="generative-art-page">
  <header>
    <h1>인터랙티브 제너레이티브 아트</h1>
    <p>
      알고리즘을 활용한 생성적 예술을 경험해보세요. 마우스로 화면을 드래그하면 
      파티클들이 마우스 포인터를 향해 이동합니다. 아래의 컨트롤을 조정하여 
      다양한 시각적 효과를 만들어보세요.
    </p>
  </header>

  <section class="demo-section">
    <div class="canvas-container">
      <GenerativeArt
        {particleCount}
        {particleSpeed}
        {particleSize}
        {colorMode}
        {backgroundColor}
        {lineOpacity}
        {noiseScale}
        {noiseStrength}
        {customColors}
      />
    </div>
    
    <div class="controls-container">
      <div class="presets">
        <h3>프리셋</h3>
        <div class="preset-buttons">
          <button on:click={() => applyPreset('calm')}>고요한 흐름</button>
          <button on:click={() => applyPreset('energetic')}>활기찬 파티클</button>
          <button on:click={() => applyPreset('minimal')}>미니멀</button>
        </div>
      </div>
      
      <div class="slider-controls">
        <h3>설정</h3>
        
        <div class="control">
          <label for="particle-count">파티클 개수: {particleCount}</label>
          <input 
            id="particle-count" 
            type="range" 
            min="10" 
            max="300" 
            step="5" 
            bind:value={particleCount} 
          />
        </div>
        
        <div class="control">
          <label for="particle-speed">속도: {particleSpeed}</label>
          <input 
            id="particle-speed" 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.1" 
            bind:value={particleSpeed} 
          />
        </div>
        
        <div class="control">
          <label for="particle-size">크기: {particleSize}px</label>
          <input 
            id="particle-size" 
            type="range" 
            min="1" 
            max="15" 
            step="0.5" 
            bind:value={particleSize} 
          />
        </div>
        
        <div class="control">
          <label for="line-opacity">선 투명도: {lineOpacity}</label>
          <input 
            id="line-opacity" 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            bind:value={lineOpacity} 
          />
        </div>
        
        <div class="control">
          <label for="noise-scale">노이즈 스케일: {noiseScale}</label>
          <input 
            id="noise-scale" 
            type="range" 
            min="0.001" 
            max="0.05" 
            step="0.001" 
            bind:value={noiseScale} 
          />
        </div>
        
        <div class="control">
          <label for="noise-strength">노이즈 강도: {noiseStrength}</label>
          <input 
            id="noise-strength" 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1" 
            bind:value={noiseStrength} 
          />
        </div>
        
        <div class="control">
          <label for="color-mode">색상 모드:</label>
          <div class="radio-group">
            <label>
              <input type="radio" name="colorMode" value="rainbow" bind:group={colorMode} />
              무지개
            </label>
            <label>
              <input type="radio" name="colorMode" value="monochrome" bind:group={colorMode} />
              단색
            </label>
            <label>
              <input type="radio" name="colorMode" value="custom" bind:group={colorMode} />
              커스텀
            </label>
          </div>
        </div>
        
        <div class="control">
          <label for="background-color">배경색:</label>
          <input 
            id="background-color" 
            type="color" 
            bind:value={backgroundColor} 
          />
        </div>
      </div>
    </div>
  </section>
  
  <section class="explanation">
    <h2>제너레이티브 아트란?</h2>
    <p>
      제너레이티브 아트(Generative Art)는 알고리즘, 수학적 규칙, 또는 자율적인 시스템을 통해 
      창작되는 예술 형태입니다. 작가는 직접 작품을 그리는 것이 아니라, 작품이 스스로 생성될 수 
      있는 규칙과 시스템을 설계합니다.
    </p>
    
    <div class="info-grid">
      <div class="info-card">
        <h3>퍼린 노이즈(Perlin Noise)</h3>
        <p>
          이 데모에서 사용된 핵심 알고리즘 중 하나는 퍼린 노이즈입니다. 1983년 켄 퍼린(Ken Perlin)이 
          개발한 이 알고리즘은 자연스러운 움직임과 패턴을 생성하는 데 사용됩니다. 파티클의 움직임이 
          무작위적이면서도 유기적인 흐름을 가지는 것이 이 알고리즘 덕분입니다.
        </p>
      </div>
      
      <div class="info-card">
        <h3>창발성(Emergence)</h3>
        <p>
          각 파티클은 간단한 규칙을 따르지만, 수백 개의 파티클이 상호작용하면서 복잡하고 예측할 수 없는 
          패턴이 형성됩니다. 이러한 현상을 '창발성'이라고 하며, 제너레이티브 아트의 핵심 특성 중 하나입니다.
        </p>
      </div>
      
      <div class="info-card">
        <h3>인터랙티비티</h3>
        <p>
          관람자의 참여는 제너레이티브 아트에 새로운 차원을 더합니다. 이 데모에서는 마우스 드래그를 통해 
          파티클의 움직임에 영향을 줄 수 있어, 작품과 관람자 사이의 대화가 가능합니다.
        </p>
      </div>
      
      <div class="info-card">
        <h3>매개변수 공간</h3>
        <p>
          슬라이더를 조정하면서 다양한 시각적 효과를 탐색할 수 있는 이 공간을 '매개변수 공간'이라고 
          합니다. 무한히 많은 가능성 중에서 여러분이 만족하는 설정을 찾아보세요.
        </p>
      </div>
    </div>
  </section>
  
  <section class="further-learning">
    <h2>더 알아보기</h2>
    <div class="link-cards">
      <a href="/demos/sound-visualizer" class="link-card">
        <h3>사운드 시각화</h3>
        <p>오디오 신호를 다양한 형태의 시각적 효과로 변환하는 예제를 살펴보세요.</p>
      </a>
      
      <a href="/demos/adsr" class="link-card">
        <h3>ADSR 엔벨로프</h3>
        <p>소리의 시작, 지속, 감쇠, 종료를 제어하는 ADSR 엔벨로프에 대해 알아보세요.</p>
      </a>
      
      <a href="https://p5js.org" target="_blank" rel="noopener noreferrer" class="link-card">
        <h3>p5.js 라이브러리</h3>
        <p>이 데모에 사용된 p5.js 라이브러리의 공식 사이트를 방문하여 더 많은 예제를 확인하세요.</p>
      </a>
      
      <a href="https://openprocessing.org" target="_blank" rel="noopener noreferrer" class="link-card">
        <h3>OpenProcessing</h3>
        <p>창작자들이 공유하는 수많은 제너레이티브 아트 작품을 감상하고 코드를 학습해보세요.</p>
      </a>
    </div>
  </section>
</div>

<style>
  .generative-art-page {
    max-width: 100%;
  }
  
  header {
    margin-bottom: 2rem;
  }
  
  header h1 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
    color: #fff;
  }
  
  header p {
    font-size: 1.1rem;
    color: #ccc;
    max-width: 800px;
  }
  
  .demo-section {
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .canvas-container {
    width: 100%;
    background: #0a0a0a;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
  
  .controls-container {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .presets {
    margin-bottom: 1.5rem;
  }
  
  .preset-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  
  .preset-buttons button {
    padding: 0.6rem 1.2rem;
    background-color: #2a2a2a;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }
  
  .preset-buttons button:hover {
    background-color: #3a3a3a;
  }
  
  .slider-controls h3, .presets h3 {
    font-size: 1.2rem;
    margin: 0 0 1rem;
    color: #fff;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
  }
  
  .control {
    margin-bottom: 1.2rem;
  }
  
  .control label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ddd;
    font-weight: 500;
  }
  
  .control input[type="range"] {
    width: 100%;
    background: #2a2a2a;
    height: 8px;
    border-radius: 4px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }
  
  .control input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #5b8fb9;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .control input[type="color"] {
    width: 60px;
    height: 30px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .radio-group {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  
  .radio-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .radio-group input {
    cursor: pointer;
  }
  
  h2 {
    font-size: 1.8rem;
    margin: 2rem 0 1rem;
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
  
  .explanation {
    margin-bottom: 3rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .info-card {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .info-card h3 {
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 1rem;
    color: #fff;
  }
  
  .info-card p {
    color: #ccc;
    line-height: 1.5;
    margin: 0;
  }
  
  .further-learning {
    margin-bottom: 3rem;
  }
  
  .link-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .link-card {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    transition: transform 0.2s;
    display: block;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .link-card:hover {
    transform: translateY(-5px);
    background: #222;
  }
  
  .link-card h3 {
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #5b8fb9;
  }
  
  .link-card p {
    color: #ccc;
    font-size: 0.9rem;
    margin: 0;
  }
  
  @media (min-width: 768px) {
    .demo-section {
      flex-direction: row;
    }
    
    .canvas-container {
      flex: 2;
    }
    
    .controls-container {
      flex: 1;
    }
  }
  
  @media (max-width: 768px) {
    .radio-group {
      flex-direction: column;
      gap: 0.8rem;
    }
  }
</style>
