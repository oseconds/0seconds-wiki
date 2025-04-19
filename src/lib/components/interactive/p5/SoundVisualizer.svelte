<!-- filepath: /Users/oyeongseo/Coding/0seconds-wiki/src/lib/components/interactive/p5/SoundVisualizer.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import P5Wrapper from './P5Wrapper.svelte';
  import * as Tone from 'tone';
  import type p5 from 'p5';

  // 시각화 설정
  export let width = 800;
  export let height = 400;
  export let bgColor = '#111';
  export let waveColor = '#5b8fb9';
  export let freqColor = '#b15eff';
  export let enableMic = false;

  // 오디오 소스
  export let audioURL: string | undefined = undefined;
  
  // 내부 상태
  let p5Instance: p5;
  let isPlaying = false;
  let audioPlayer: Tone.Player | undefined;
  let analyser: Tone.Analyser | undefined;
  let micAnalyser: Tone.Analyser | undefined;
  let mic: Tone.UserMedia | undefined;
  let waveform: Float32Array;
  let frequencies: Float32Array;
  
  // 시각화 모드
  export let visualizationMode: 'waveform' | 'frequency' | 'both' = 'both';
  
  // p5 스케치 정의
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(width, height);
      p.background(bgColor);
      p.noFill();
    };

    p.draw = () => {
      p.background(bgColor);
      
      if (waveform && (visualizationMode === 'waveform' || visualizationMode === 'both')) {
        drawWaveform(p);
      }
      
      if (frequencies && (visualizationMode === 'frequency' || visualizationMode === 'both')) {
        drawFrequencies(p);
      }
    };
  };

  function drawWaveform(p: p5) {
    p.stroke(waveColor);
    p.strokeWeight(2);
    p.beginShape();
    
    // 파형 그리기
    for (let i = 0; i < waveform.length; i++) {
      const x = p.map(i, 0, waveform.length - 1, 0, width);
      const y = p.map(waveform[i], -1, 1, height * 0.75, height * 0.25);
      p.vertex(x, y);
    }
    
    p.endShape();
  }

  function drawFrequencies(p: p5) {
    p.noStroke();
    p.fill(freqColor);
    
    // 주파수 스펙트럼 그리기
    const barWidth = width / frequencies.length;
    
    for (let i = 0; i < frequencies.length; i++) {
      const freq = frequencies[i];
      const barHeight = p.map(freq, -100, 0, 0, height * 0.5);
      const x = i * barWidth;
      const y = height - barHeight;
      
      // 주파수에 따라 색상 변경
      const hue = p.map(i, 0, frequencies.length, 180, 360);
      p.fill(p.color(`hsla(${hue}, 80%, 50%, 0.7)`));
      
      p.rect(x, y, barWidth, barHeight);
    }
  }

  // 오디오 초기화 및 재생
  async function initAudio() {
    try {
      await Tone.start();
      
      if (audioURL) {
        // 외부 오디오 파일 사용
        audioPlayer = new Tone.Player({
          url: audioURL,
          loop: true,
          autostart: false,
          onload: () => {
            console.log("Audio loaded");
          },
        }).toDestination();

        // 분석기 설정
        analyser = new Tone.Analyser({
          type: "waveform",
          size: 1024,
        });
        
        audioPlayer.connect(analyser);
        
        // 주파수 분석기
        const freqAnalyser = new Tone.Analyser({
          type: "fft",
          size: 64,
        });
        
        audioPlayer.connect(freqAnalyser);

        // 분석 루프
        const updateAnalysers = () => {
          if (analyser && freqAnalyser) {
            waveform = analyser.getValue() as Float32Array;
            frequencies = freqAnalyser.getValue() as Float32Array;
          }
          requestAnimationFrame(updateAnalysers);
        };
        
        updateAnalysers();
      }
      
      // 마이크 사용 설정
      if (enableMic) {
        mic = new Tone.UserMedia();
        await mic.open();
        
        micAnalyser = new Tone.Analyser({
          type: "waveform",
          size: 1024,
        });
        
        // 주파수 분석기
        const micFreqAnalyser = new Tone.Analyser({
          type: "fft",
          size: 64,
        });
        
        mic.connect(micAnalyser);
        mic.connect(micFreqAnalyser);

        // 분석 루프
        const updateMicAnalysers = () => {
          if (micAnalyser && micFreqAnalyser) {
            waveform = micAnalyser.getValue() as Float32Array;
            frequencies = micFreqAnalyser.getValue() as Float32Array;
          }
          requestAnimationFrame(updateMicAnalysers);
        };
        
        updateMicAnalysers();
      }
    } catch (error) {
      console.error("오디오 초기화 오류:", error);
    }
  }

  async function togglePlayback() {
    if (!isPlaying) {
      if (enableMic && mic) {
        // 마이크 시작
        await Tone.start();
        isPlaying = true;
      } else if (audioPlayer) {
        // 오디오 플레이어 시작
        await Tone.start();
        audioPlayer.start();
        isPlaying = true;
      }
    } else {
      if (enableMic && mic) {
        // 마이크는 중지만 하고 닫지 않음
        isPlaying = false;
      } else if (audioPlayer) {
        audioPlayer.stop();
        isPlaying = false;
      }
    }
  }

  // 마이크 활성화 토글
  async function toggleMic() {
    enableMic = !enableMic;
    
    // 오디오 플레이어 중지
    if (audioPlayer && isPlaying) {
      audioPlayer.stop();
      isPlaying = false;
    }
    
    // 마이크 다시 초기화
    if (mic) {
      mic.close();
      mic = undefined;
    }
    
    // 새로운 설정으로 오디오 초기화
    await initAudio();
  }

  onMount(async () => {
    await initAudio();
  });

  onDestroy(() => {
    if (audioPlayer) {
      audioPlayer.stop();
      audioPlayer.dispose();
    }
    
    if (mic) {
      mic.close();
    }
    
    if (analyser) {
      analyser.dispose();
    }
    
    if (micAnalyser) {
      micAnalyser.dispose();
    }
  });
</script>

<div class="sound-visualizer">
  <P5Wrapper {sketch} {width} {height} bind:p5Instance />
  
  <div class="controls">
    <button on:click={togglePlayback} class="control-btn">
      {isPlaying ? '정지' : '시작'}
    </button>
    
    <div class="mode-selector">
      <label>
        <input type="radio" bind:group={visualizationMode} value="waveform">
        <span>파형</span>
      </label>
      
      <label>
        <input type="radio" bind:group={visualizationMode} value="frequency">
        <span>주파수</span>
      </label>
      
      <label>
        <input type="radio" bind:group={visualizationMode} value="both">
        <span>모두</span>
      </label>
    </div>
    
    <div class="mic-toggle">
      <label>
        <input type="checkbox" bind:checked={enableMic} on:change={toggleMic}>
        <span>마이크 사용</span>
      </label>
    </div>
  </div>
  
  <div class="description">
    <h3>사운드 시각화 데모</h3>
    <p>
      이 데모는 오디오 신호(파형)와 주파수 스펙트럼을 실시간으로 시각화합니다. 
      '시작' 버튼을 클릭하여 기본 오디오를 재생하거나, '마이크 사용' 옵션을 켜서 
      자신의 목소리나 주변 소리를 시각화해 보세요.
    </p>
    <p>
      파형은 소리의 진폭(볼륨)을 시간에 따라 보여주고, 
      주파수 스펙트럼은 각 주파수 대역의 에너지를 색깔 막대로 표시합니다.
    </p>
  </div>
</div>

<style>
  .sound-visualizer {
    background: #111;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin: 1.5rem 0;
    align-items: center;
  }
  
  .control-btn {
    padding: 0.6rem 1.2rem;
    background-color: #5b8fb9;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .control-btn:hover {
    background-color: #4a759a;
  }
  
  .mode-selector {
    display: flex;
    gap: 1rem;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #ccc;
    cursor: pointer;
  }
  
  input[type="radio"],
  input[type="checkbox"] {
    cursor: pointer;
    accent-color: #5b8fb9;
  }
  
  .description {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 4px;
    margin-top: 1.5rem;
  }
  
  .description h3 {
    margin-top: 0;
    color: white;
  }
  
  .description p {
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0.5rem 0;
  }
  
  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .mode-selector {
      flex-wrap: wrap;
    }
  }
</style>
