<!-- filepath: /Users/oyeongseo/Coding/0seconds-wiki/src/routes/demos/sound-visualizer/+page.svelte -->
<script lang="ts">
  import SoundVisualizer from '$lib/components/interactive/p5/SoundVisualizer.svelte';
  import { onMount } from 'svelte';
  
  // 샘플 오디오 URL
  const sampleAudioURL = '/audio/sample-loop.mp3';
  
  // 화면 크기에 따른 시각화 크기 조정
  let containerWidth = 800;
  
  onMount(() => {
    const updateWidth = () => {
      const container = document.querySelector('.demo-container');
      if (container) {
        containerWidth = container.clientWidth;
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  });
</script>

<svelte:head>
  <title>사운드 시각화 - 0seconds Wiki</title>
  <meta name="description" content="실시간 오디오 파형과 주파수 스펙트럼 시각화 데모" />
</svelte:head>

<div class="demo-container">
  <h1>사운드 시각화</h1>
  
  <div class="intro">
    <p>
      이 페이지는 오디오 신호를 실시간으로 시각화하는 방법을 보여줍니다.
      소리의 파형과 주파수 스펙트럼을 통해 음향의 특성을 시각적으로 이해할 수 있습니다.
    </p>
  </div>

  <section class="demo-section">
    <h2>실시간 오디오 시각화</h2>
    
    <SoundVisualizer 
      width={containerWidth} 
      height={400} 
      audioURL={sampleAudioURL}
      waveColor="#4cc9f0"
      freqColor="#f72585"
    />
    
    <div class="info-box">
      <h3>이렇게 활용해 보세요</h3>
      <ul>
        <li>마이크를 활성화하여 실시간으로 목소리나 악기 소리를 시각화해 보세요.</li>
        <li>다양한 소리를 내보며 파형과 주파수 스펙트럼의 변화를 관찰해 보세요.</li>
        <li>저음은 주파수 스펙트럼의 왼쪽에, 고음은 오른쪽에 표시됩니다.</li>
        <li>큰 소리는 파형의 진폭(위아래 움직임)이 커집니다.</li>
      </ul>
    </div>
  </section>

  <section class="theory-section">
    <h2>파형과 주파수 스펙트럼의 이해</h2>
    
    <div class="theory-content">
      <div class="theory-text">
        <h3>파형(Waveform)</h3>
        <p>
          파형은 소리의 압력 변화를 시간에 따라 표현한 것입니다. 파형의 높낮이(진폭)는
          소리의 크기(볼륨)를 나타내고, 파형의 반복 패턴은 소리의 주기를 보여줍니다.
          순수한 사인파는 단일 주파수를 가진 가장 기본적인 파형이며, 대부분의 소리는
          여러 주파수 성분이 합쳐진 복잡한 파형으로 나타납니다.
        </p>
        
        <h3>주파수 스펙트럼(Frequency Spectrum)</h3>
        <p>
          주파수 스펙트럼은 소리를 구성하는 다양한 주파수 성분과 각 성분의 강도를 보여줍니다.
          이는 푸리에 변환(Fourier Transform)이라는 수학적 기법을 통해 시간 영역의 파형을
          주파수 영역으로 변환하여 얻을 수 있습니다. 주파수 스펙트럼을 통해 소리의 음색이나
          특성을 분석할 수 있으며, 이퀄라이저 등의 오디오 처리에 활용됩니다.
        </p>
      </div>
      
      <div class="application">
        <h3>응용 분야</h3>
        <ul>
          <li><strong>음향 분석:</strong> 녹음된 소리나 악기의 특성 분석</li>
          <li><strong>음성 인식:</strong> 목소리의 패턴을 인식하여 텍스트로 변환</li>
          <li><strong>오디오 처리:</strong> 이퀄라이저, 컴프레서 등의 오디오 효과 적용</li>
          <li><strong>음악 시각화:</strong> 음악에 반응하는 시각적 효과 생성</li>
          <li><strong>소음 감지:</strong> 특정 주파수 패턴을 통한 소음이나 이상 감지</li>
        </ul>
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
    margin-bottom: 1.5rem;
    color: #f72585;
  }
  
  h2 {
    font-size: 1.8rem;
    margin: 2rem 0 1rem;
    color: #4cc9f0;
    border-bottom: 2px solid rgba(76, 201, 240, 0.3);
    padding-bottom: 0.5rem;
  }
  
  h3 {
    font-size: 1.4rem;
    margin: 1.5rem 0 0.75rem;
    color: #4361ee;
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
  
  .info-box {
    background: rgba(76, 201, 240, 0.1);
    border-left: 4px solid #4cc9f0;
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    border-radius: 0 8px 8px 0;
  }
  
  .info-box ul {
    padding-left: 1.5rem;
  }
  
  .info-box li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  
  .theory-section {
    margin-bottom: 3rem;
  }
  
  .theory-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .theory-text p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .application ul {
    list-style-type: none;
    padding: 0;
  }
  
  .application li {
    padding: 1rem;
    background: rgba(67, 97, 238, 0.1);
    margin-bottom: 0.75rem;
    border-radius: 6px;
    transition: transform 0.2s, background 0.2s;
  }
  
  .application li:hover {
    transform: translateX(5px);
    background: rgba(67, 97, 238, 0.2);
  }
  
  .application strong {
    color: #4361ee;
  }
  
  @media (max-width: 768px) {
    .theory-content {
      grid-template-columns: 1fr;
    }
    
    h1 {
      font-size: 2rem;
    }
  }
</style>
