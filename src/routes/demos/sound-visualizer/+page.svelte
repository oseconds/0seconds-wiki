<script lang="ts">
  import { onMount } from 'svelte';
  import SoundVisualizer from '$lib/components/interactive/p5/SoundVisualizer.svelte';

  // 시각화 설정
  let visualizationType = 'circular';
  let sensitivity = 1.5;
  let smoothing = 0.8;
  let colorScheme = 'spectrum'; 
  let minRadius = 100;
  let barWidth = 15;
  let barSpacing = 5;
  let backgroundColor = '#121212';
  
  // 오디오 설정
  let audioElement: HTMLAudioElement;
  let isPlaying = false;
  let currentTrack = 0;
  
  // 오디오 파일 목록 (데모용)
  const tracks = [
    {
      title: '드럼 루프',
      artist: '0seconds',
      file: '/audio/drum-loop.mp3',
      description: '다양한 리듬 요소로 구성된 드럼 루프'
    },
    {
      title: '앰비언트 패드',
      artist: '0seconds',
      file: '/audio/ambient-pad.mp3',
      description: '공간감이 넓은 신디사이저 패드 사운드'
    },
    {
      title: '베이스 그루브',
      artist: '0seconds',
      file: '/audio/bass-groove.mp3',
      description: '펑키한 베이스 라인'
    }
  ];
  
  function playPause() {
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
    } else {
      if (audioElement.readyState >= 2) { // HAVE_CURRENT_DATA
        audioElement.play();
        isPlaying = true;
      }
    }
  }
  
  function changeTrack(index: number) {
    if (currentTrack !== index) {
      currentTrack = index;
      isPlaying = false;
      setTimeout(() => {
        audioElement.load();
        if (audioElement.readyState >= 2) {
          audioElement.play();
          isPlaying = true;
        }
      }, 100);
    } else {
      playPause();
    }
  }
  
  onMount(() => {
    // 처음 로드될 때 오디오 요소 초기화
    if (audioElement) {
      audioElement.volume = 0.6;
      audioElement.load();
    }
    
    return () => {
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
      }
    };
  });
</script>

<svelte:head>
  <title>사운드 시각화 | 0seconds Wiki</title>
  <meta name="description" content="p5.js와 Web Audio API를 활용한 인터랙티브 사운드 시각화를 경험해보세요." />
</svelte:head>

<div class="sound-visualizer-page">
  <header>
    <h1>인터랙티브 사운드 시각화</h1>
    <p>
      오디오를 다양한 형태로 시각화하는 기술을 경험해보세요. 
      음악을 재생하고 아래의 컨트롤을 조정하여 
      소리가 만들어내는 시각적 패턴을 탐색해보세요.
    </p>
  </header>

  <section class="demo-section">
    <div class="audio-player">
      <audio bind:this={audioElement} crossorigin="anonymous">
        <source src={tracks[currentTrack].file} type="audio/mp3" />
        브라우저가 오디오 태그를 지원하지 않습니다.
      </audio>
      
      <div class="track-info">
        <h3>{tracks[currentTrack].title}</h3>
        <p class="artist">{tracks[currentTrack].artist}</p>
        <p class="description">{tracks[currentTrack].description}</p>
      </div>
      
      <div class="playlist">
        <h3>트랙 목록</h3>
        <div class="track-list">
          {#each tracks as track, i}
            <button 
              class="track-button" 
              class:active={currentTrack === i} 
              on:click={() => changeTrack(i)}
            >
              <span class="track-button-icon">
                {#if currentTrack === i && isPlaying}
                  ⏸️
                {:else}
                  ▶️
                {/if}
              </span>
              <span class="track-button-text">
                {track.title}
              </span>
            </button>
          {/each}
        </div>
      </div>
    </div>
    
    <div class="visualizer-container">
      <SoundVisualizer 
        {visualizationType}
        {sensitivity}
        {smoothing}
        {colorScheme}
        {minRadius}
        {barWidth}
        {barSpacing}
        {backgroundColor}
        audioSource={audioElement}
        {isPlaying}
      />
      
      <div class="play-controls">
        <button on:click={playPause} class="play-button">
          {#if isPlaying}
            정지
          {:else}
            재생
          {/if}
        </button>
      </div>
    </div>
  </section>
  
  <section class="controls-container">
    <h2>시각화 설정</h2>
    
    <div class="control-grid">
      <div class="control">
        <label for="visualization-type">시각화 유형</label>
        <select id="visualization-type" bind:value={visualizationType}>
          <option value="circular">원형</option>
          <option value="bars">바</option>
          <option value="waveform">웨이브폼</option>
        </select>
      </div>
      
      <div class="control">
        <label for="sensitivity">감도: {sensitivity}</label>
        <input 
          id="sensitivity" 
          type="range" 
          min="0.5" 
          max="3" 
          step="0.1" 
          bind:value={sensitivity} 
        />
      </div>
      
      <div class="control">
        <label for="smoothing">스무딩: {smoothing}</label>
        <input 
          id="smoothing" 
          type="range" 
          min="0" 
          max="0.95" 
          step="0.05" 
          bind:value={smoothing} 
        />
      </div>
      
      <div class="control">
        <label for="color-scheme">색상 구성</label>
        <select id="color-scheme" bind:value={colorScheme}>
          <option value="spectrum">스펙트럼</option>
          <option value="gradient">그라데이션</option>
          <option value="monochrome">단색</option>
        </select>
      </div>
      
      {#if visualizationType === 'circular'}
        <div class="control">
          <label for="min-radius">최소 반경: {minRadius}px</label>
          <input 
            id="min-radius" 
            type="range" 
            min="50" 
            max="200" 
            step="5" 
            bind:value={minRadius} 
          />
        </div>
      {/if}
      
      {#if visualizationType === 'bars'}
        <div class="control">
          <label for="bar-width">바 너비: {barWidth}px</label>
          <input 
            id="bar-width" 
            type="range" 
            min="3" 
            max="30" 
            step="1" 
            bind:value={barWidth} 
          />
        </div>
        
        <div class="control">
          <label for="bar-spacing">바 간격: {barSpacing}px</label>
          <input 
            id="bar-spacing" 
            type="range" 
            min="0" 
            max="15" 
            step="1" 
            bind:value={barSpacing} 
          />
        </div>
      {/if}
      
      <div class="control">
        <label for="background-color">배경색:</label>
        <input 
          id="background-color" 
          type="color" 
          bind:value={backgroundColor} 
        />
      </div>
    </div>
  </section>
  
  <section class="explanation">
    <h2>사운드 시각화의 원리</h2>
    
    <div class="info-grid">
      <div class="info-card">
        <h3>푸리에 변환(FFT)</h3>
        <p>
          이 시각화는 고속 푸리에 변환(FFT)을 사용하여 오디오 신호를 주파수 도메인으로 변환합니다. 
          시간에 따른 소리의 파형을 다양한 주파수 대역으로 분해하여, 각 주파수의 진폭을 시각적으로 
          표현하는 것이 핵심입니다.
        </p>
      </div>
      
      <div class="info-card">
        <h3>실시간 오디오 분석</h3>
        <p>
          Web Audio API는 오디오 신호를 실시간으로 분석하는 강력한 도구를 제공합니다. 
          AnalyserNode를 통해 오디오 데이터를 지속적으로 샘플링하고, 이를 p5.js를 
          사용하여 캔버스에 시각적으로 렌더링합니다.
        </p>
      </div>
      
      <div class="info-card">
        <h3>시각화 유형</h3>
        <p>
          이 데모에서는 세 가지 시각화 방식을 제공합니다:
        </p> <!-- </p> 태그를 여기서 닫습니다. -->
        <ul> <!-- <ul> 태그를 <p> 태그 밖으로 이동합니다. -->
          <li><strong>원형(Circular):</strong> 주파수 데이터를 원형으로 배치하여 소리의 전체적인 스펙트럼을 표현</li>
          <li><strong>바(Bars):</strong> 전통적인 오디오 스펙트럼 디스플레이로, 각 주파수 대역을 수직 막대로 표현</li>
          <li><strong>웨이브폼(Waveform):</strong> 시간에 따른 오디오 신호의 진폭을 파형으로 표현</li>
        </ul>
        <!-- 기존 </p> 태그는 제거합니다. -->
      </div>
      
      <div class="info-card">
        <h3>매개변수 조절</h3>
        <p>
          다양한 매개변수를 조절하여 시각화 효과를 변경할 수 있습니다:
          <ul>
            <li><strong>감도:</strong> 오디오 신호에 대한 시각적 반응의 강도</li>
            <li><strong>스무딩:</strong> 프레임 간 값의 변화를 부드럽게 만들어 시각적 안정성 제공</li>
            <li><strong>색상 구성:</strong> 주파수 또는 진폭에 따른 색상 매핑 방식</li>
          </ul>
        </p>
      </div>
    </div>
  </section>
  
  <section class="applications">
    <h2>사운드 시각화의 응용</h2>
    
    <div class="app-grid">
      <div class="app-card">
        <div class="icon">🎵</div>
        <h3>음악 플레이어</h3>
        <p>
          음악 재생 앱이나 웹사이트에서 시각적 피드백을 제공하여 사용자 경험을 향상시킵니다. 
          Spotify, iTunes, Winamp와 같은 플레이어들이 이러한 기술을 활용합니다.
        </p>
      </div>
      
      <div class="app-card">
        <div class="icon">🎬</div>
        <h3>라이브 공연</h3>
        <p>
          콘서트, DJ 공연, 라이브 쇼 등에서 음악에 반응하는 시각 효과를 만들어 관객의 
          몰입감을 높이는 데 활용됩니다.
        </p>
      </div>
      
      <div class="app-card">
        <div class="icon">🧪</div>
        <h3>음향 분석</h3>
        <p>
          오디오 엔지니어링, 음향학 연구 등에서 소리의 특성을 분석하고 시각화하는 도구로 
          활용됩니다.
        </p>
      </div>
      
      <div class="app-card">
        <div class="icon">🎨</div>
        <h3>인터랙티브 아트</h3>
        <p>
          전시회, 인터랙티브 설치 작품 등에서 관람객의 소리나 음악에 반응하는 시각적 
          작품을 만드는 데 사용됩니다.
        </p>
      </div>
    </div>
  </section>
  
  <section class="further-learning">
    <h2>더 알아보기</h2>
    <div class="link-cards">
      <a href="/demos/generative-art" class="link-card">
        <h3>제너레이티브 아트</h3>
        <p>알고리즘을 활용한 인터랙티브 생성적 예술을 경험해보세요.</p>
      </a>
      
      <a href="/demos/adsr" class="link-card">
        <h3>ADSR 엔벨로프</h3>
        <p>소리의 시작, 지속, 감쇠, 종료를 제어하는 ADSR 엔벨로프에 대해 알아보세요.</p>
      </a>
      
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank" rel="noopener noreferrer" class="link-card">
        <h3>Web Audio API</h3>
        <p>웹 브라우저에서 고급 오디오 처리를 위한 Web Audio API에 대해 자세히 알아보세요.</p>
      </a>
      
      <a href="https://p5js.org/examples/" target="_blank" rel="noopener noreferrer" class="link-card">
        <h3>p5.js 예제</h3>
        <p>다양한 p5.js 예제를 통해 창의적인 코딩의 가능성을 탐색해보세요.</p>
      </a>
    </div>
  </section>
</div>

<style>
  .sound-visualizer-page {
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
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .audio-player {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
    height: fit-content;
  }
  
  .track-info {
    margin-bottom: 1.5rem;
  }
  
  .track-info h3 {
    font-size: 1.4rem;
    margin: 0 0 0.5rem;
    color: #fff;
  }
  
  .artist {
    font-size: 1rem;
    color: #5b8fb9;
    margin: 0 0 0.5rem;
  }
  
  .description {
    color: #ccc;
    font-size: 0.9rem;
    margin: 0;
  }
  
  .playlist h3 {
    font-size: 1.2rem;
    margin: 0 0 1rem;
    color: #fff;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
  }
  
  .track-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .track-button {
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem;
    border: none;
    border-radius: 4px;
    background: #2a2a2a;
    color: #ccc;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }
  
  .track-button:hover {
    background: #333;
  }
  
  .track-button.active {
    background: #5b8fb9;
    color: #fff;
  }
  
  .track-button-icon {
    margin-right: 0.8rem;
    font-size: 1.2rem;
  }
  
  .visualizer-container {
    width: 100%;
    background: #0a0a0a;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
  }
  
  .play-controls {
    padding: 1rem;
    display: flex;
    justify-content: center;
  }
  
  .play-button {
    padding: 0.7rem 2.5rem;
    border: none;
    border-radius: 4px;
    background: #5b8fb9;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }
  
  .play-button:hover {
    background: #4a759a;
  }
  
  .controls-container {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 3rem;
  }
  
  h2 {
    font-size: 1.8rem;
    margin: 0 0 1.5rem;
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
  
  .control-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .control {
    margin-bottom: 1rem;
  }
  
  .control label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ddd;
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
  
  .control select, .control input[type="color"] {
    width: 100%;
    padding: 0.5rem;
    background: #2a2a2a;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .control input[type="color"] {
    height: 40px;
  }
  
  .explanation {
    margin-bottom: 3rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
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
    margin: 0;
    line-height: 1.5;
  }
  
  .info-card ul {
    margin: 0.8rem 0 0;
    padding-left: 1.5rem;
    color: #ccc;
  }
  
  .info-card li {
    margin-bottom: 0.5rem;
  }
  
  .applications {
    margin-bottom: 3rem;
  }
  
  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .app-card {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
  }
  
  .app-card .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .app-card h3 {
    font-size: 1.3rem;
    margin: 0 0 1rem;
    color: #fff;
  }
  
  .app-card p {
    color: #ccc;
    text-align: left;
    margin: 0;
    line-height: 1.5;
  }
  
  .further-learning {
    margin-bottom: 3rem;
  }
  
  .link-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .link-card {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    transition: transform 0.2s;
    display: block;
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
  
  @media (max-width: 768px) {
    .demo-section {
      grid-template-columns: 1fr;
    }
    
    .control-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
