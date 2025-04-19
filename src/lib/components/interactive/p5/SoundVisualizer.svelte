<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import P5Wrapper from './P5Wrapper.svelte';
  import * as Tone from 'tone';
  import type p5 from 'p5';

  // 시각화 설정
  export let visualizationType = 'circular'; // circular, bars, waveform
  export let sensitivity = 1.5;
  export let smoothing = 0.8;
  export let colorScheme = 'spectrum'; // spectrum, gradient, monochrome
  export let minRadius = 100;
  export let barWidth = 15;
  export let barSpacing = 5;
  export let backgroundColor = '#121212';
  
  // 오디오 설정
  export let audioSource: HTMLAudioElement | null = null;
  export let isPlaying = false;
  
  let p5Instance: p5;
  let width = 800;
  let height = 600;
  
  // Tone.js 오디오 분석 객체
  let analyser: Tone.Analyser;
  let player: Tone.Player | null = null;
  let fftSize = 1024;
  let frequencyData = new Float32Array(fftSize / 2);
  
  // 반응형을 위한 리사이즈
  function handleResize() {
    const container = document.querySelector('.visualizer-wrapper');
    if (container) {
      const containerWidth = container.clientWidth;
      width = Math.min(containerWidth, 800);
      height = width * 0.75; // 4:3 비율
      
      if (p5Instance) {
        p5Instance.resizeCanvas(width, height);
      }
    }
  }

  onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Tone.js 설정
    analyser = new Tone.Analyser('fft', fftSize);
    analyser.smoothing = smoothing;
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (player) {
        player.stop();
        player.dispose();
      }
      if (analyser) {
        analyser.dispose();
      }
    };
  });

  // 오디오 소스 변경 감지
  $: if (audioSource && isPlaying) {
    setupAudioSource(audioSource);
  }
  
  $: if (!isPlaying && player) {
    player.stop();
  }
  
  // 오디오 소스 설정
  function setupAudioSource(element: HTMLAudioElement) {
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
    
    if (player) {
      player.stop();
      player.dispose();
    }
    
    player = new Tone.Player({
      url: element.src,
      autostart: true,
      loop: true,
    }).connect(analyser).toDestination();
  }

  // p5.js 스케치 정의
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(width, height);
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.angleMode(p.RADIANS);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
    };
    
    p.draw = () => {
      p.background(backgroundColor);
      
      // Tone.js 분석기로부터 데이터 가져오기
      if (analyser) {
        frequencyData = analyser.getValue() as Float32Array;
      }
      
      // 데이터가 있고 플레이 중이라면 시각화 그리기
      if (frequencyData.length > 0 && isPlaying) {
        switch (visualizationType) {
          case 'circular':
            drawCircularVisualizer();
            break;
          case 'bars':
            drawBarsVisualizer();
            break;
          case 'waveform':
            drawWaveformVisualizer();
            break;
        }
      } else {
        // 재생 중이 아니라면 안내 메시지 표시
        p.fill(200);
        p.textSize(18);
        p.text("오디오를 재생하여 시각화를 시작하세요", width/2, height/2);
      }
    };
    
    // 원형 시각화
    function drawCircularVisualizer() {
      const centerX = width / 2;
      const centerY = height / 2;
      const bins = 64; // 표시할 주파수 밴드 수
      const step = Math.floor(frequencyData.length / bins);
      
      p.push();
      p.translate(centerX, centerY);
      
      for (let i = 0; i < bins; i++) {
        const index = i * step;
        const value = Math.max(0, frequencyData[index] + 140) * sensitivity; // dB 값을 양수로 변환
        const angle = p.map(i, 0, bins, 0, p.TWO_PI);
        
        // 주파수에 따른 반지름 계산
        const radius = minRadius + value * 2;
        
        // 색상 설정
        if (colorScheme === 'spectrum') {
          p.fill(i * (360/bins), 80, 90, 0.7);
        } else if (colorScheme === 'gradient') {
          const hue = p.map(value, 0, 100, 180, 360);
          p.fill(hue, 80, 90, 0.7);
        } else {
          p.fill(220, 30, p.map(value, 0, 100, 40, 90), 0.7);
        }
        
        // 원형 막대 그리기
        const x1 = minRadius * Math.cos(angle);
        const y1 = minRadius * Math.sin(angle);
        const x2 = radius * Math.cos(angle);
        const y2 = radius * Math.sin(angle);
        
        p.strokeWeight(3);
        p.stroke(p.hue(p.drawingContext.fillStyle), 80, 90, 0.7);
        p.line(x1, y1, x2, y2);
        
        p.noStroke();
        p.ellipse(x2, y2, 5, 5);
      }
      p.pop();
    }
    
    // 바 시각화
    function drawBarsVisualizer() {
      const bins = Math.floor(width / (barWidth + barSpacing));
      const step = Math.floor(frequencyData.length / bins);
      
      for (let i = 0; i < bins; i++) {
        const index = i * step;
        const value = Math.max(0, frequencyData[index] + 140) * sensitivity;
        const barHeight = p.map(value, 0, 100, 5, height * 0.8);
        const x = i * (barWidth + barSpacing) + barSpacing;
        
        // 색상 설정
        if (colorScheme === 'spectrum') {
          p.fill(i * (360/bins), 80, 90);
        } else if (colorScheme === 'gradient') {
          const hue = p.map(value, 0, 100, 180, 360);
          p.fill(hue, 80, 90);
        } else {
          p.fill(220, 30, p.map(value, 0, 100, 40, 90));
        }
        
        // 바 그리기
        p.rect(x, height - barHeight, barWidth, barHeight, 4);
        
        // 바 상단에 작은 원 추가
        p.fill(p.hue(p.drawingContext.fillStyle), 80, 100);
        p.ellipse(x + barWidth/2, height - barHeight - 3, barWidth * 0.8, barWidth * 0.8);
      }
    }
    
    // 웨이브폼 시각화
    function drawWaveformVisualizer() {
      const centerY = height / 2;
      const bins = width;
      const step = Math.floor(frequencyData.length / bins);
      
      p.stroke(80, 200, 255);
      p.strokeWeight(2);
      p.noFill();
      
      p.beginShape();
      for (let i = 0; i < bins; i++) {
        const index = i * step;
        const value = Math.max(0, frequencyData[index] + 140) * sensitivity;
        const amplitude = p.map(value, 0, 100, 5, height * 0.4);
        
        // 색상 설정
        if (colorScheme === 'spectrum') {
          p.stroke(i * (360/bins), 80, 90);
        } else if (colorScheme === 'gradient') {
          const hue = p.map(value, 0, 100, 180, 360);
          p.stroke(hue, 80, 90);
        } else {
          p.stroke(220, 30, p.map(value, 0, 100, 40, 90));
        }
        
        // 웨이브폼 포인트
        const x = i;
        const y = centerY + amplitude * Math.sin(i * 0.05 + p.frameCount * 0.02);
        p.point(x, y);
        
        if (i % 3 === 0) { // 성능을 위해 일부 포인트만 선으로 연결
          p.vertex(x, y);
        }
      }
      p.endShape();
    }
  };
</script>

<div class="visualizer-wrapper">
  <P5Wrapper {sketch} {width} {height} bind:p5Instance />
</div>

<style>
  .visualizer-wrapper {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
