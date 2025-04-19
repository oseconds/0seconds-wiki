<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as Tone from 'tone';
  import { spring } from 'svelte/motion';

  // ADSR 파라미터 (초기값)
  export let attack = 0.2;
  export let decay = 0.2;
  export let sustain = 0.5;
  export let release = 0.5;
  
  // 캔버스 설정
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let width = 600;
  let height = 200;
  let animationId: number;
  let isPlaying = false;
  
  // 신디사이저 설정
  let synth: Tone.PolySynth;
  let note = "C4"; // 기본 노트
  
  // 애니메이션을 위한 spring 값
  const envelopePosition = spring(0, {
    stiffness: 0.05,
    damping: 0.3
  });
  
  onMount(() => {
    // 캔버스 설정
    ctx = canvas.getContext('2d')!;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 신디사이저 설정
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    updateSynthEnvelope();
    
    // 초기 파형 그리기
    drawEnvelope();
  });
  
  onDestroy(() => {
    window.removeEventListener('resize', resizeCanvas);
    if (animationId) cancelAnimationFrame(animationId);
    synth?.dispose();
  });
  
  function resizeCanvas() {
    const container = canvas.parentElement;
    if (container) {
      width = container.clientWidth;
      canvas.width = width;
      canvas.height = height;
    }
    drawEnvelope();
  }
  
  // ADSR 값이 변경되면 신디사이저 업데이트
  $: {
    if (synth) {
      updateSynthEnvelope();
      drawEnvelope();
    }
  }
  
  function updateSynthEnvelope() {
    synth.set({
      envelope: {
        attack,
        decay,
        sustain,
        release
      }
    });
  }
  
  function drawEnvelope() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    
    // 배경 그리드 그리기
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
    ctx.lineWidth = 1;
    
    // 수평 그리드
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // 수직 그리드
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // ADSR 엔벨로프 그리기
    const attackWidth = Math.min(width * 0.2, attack * width * 0.4);
    const decayWidth = Math.min(width * 0.2, decay * width * 0.4);
    const sustainWidth = Math.min(width * 0.3, width * 0.3);
    const releaseWidth = Math.min(width * 0.3, release * width * 0.6);
    
    const startX = 10;
    let currentX = startX;
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#5b8fb9';
    ctx.beginPath();
    ctx.moveTo(currentX, height - 20);
    
    // Attack
    currentX += attackWidth;
    ctx.lineTo(currentX, 20);
    
    // Decay
    currentX += decayWidth;
    ctx.lineTo(currentX, height - 20 - (height - 40) * sustain);
    
    // Sustain
    currentX += sustainWidth;
    ctx.lineTo(currentX, height - 20 - (height - 40) * sustain);
    
    // Release
    currentX += releaseWidth;
    ctx.lineTo(currentX, height - 20);
    
    ctx.stroke();
    
    // 각 포인트에 점 표시
    const points = [
      { x: startX, y: height - 20, label: 'Start' },
      { x: startX + attackWidth, y: 20, label: 'Attack' },
      { x: startX + attackWidth + decayWidth, y: height - 20 - (height - 40) * sustain, label: 'Decay' },
      { x: startX + attackWidth + decayWidth + sustainWidth, y: height - 20 - (height - 40) * sustain, label: 'Sustain' },
      { x: startX + attackWidth + decayWidth + sustainWidth + releaseWidth, y: height - 20, label: 'Release' }
    ];
    
    ctx.fillStyle = '#fff';
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#ccc';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, point.x, point.y + 20);
    });
    
    // 애니메이션 진행 위치 표시 (재생 중일 때만)
    if (isPlaying) {
      const pos = $envelopePosition;
      const fullWidth = attackWidth + decayWidth + sustainWidth + releaseWidth;
      const x = startX + pos * fullWidth;
      
      let y;
      if (pos < attackWidth / fullWidth) {
        // 어택 단계
        y = height - 20 - (height - 40) * (pos * fullWidth) / attackWidth;
      } else if (pos < (attackWidth + decayWidth) / fullWidth) {
        // 디케이 단계
        const decayPos = (pos * fullWidth - attackWidth) / decayWidth;
        y = 20 + (height - 20 - (height - 40) * sustain - 20) * decayPos;
      } else if (pos < (attackWidth + decayWidth + sustainWidth) / fullWidth) {
        // 서스테인 단계
        y = height - 20 - (height - 40) * sustain;
      } else {
        // 릴리즈 단계
        const releasePos = (pos * fullWidth - attackWidth - decayWidth - sustainWidth) / releaseWidth;
        y = height - 20 - (height - 40) * sustain + (height - 40) * sustain * releasePos;
      }
      
      ctx.fillStyle = '#ff0';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function playNote() {
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
    
    isPlaying = true;
    synth.triggerAttack(note);
    
    // 엔벨로프 애니메이션 시작
    const totalDuration = attack + decay + 1 + release; // 1초의 서스테인
    let startTime = performance.now();
    
    // 애니메이션 프레임 함수
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000; // 초 단위로 변환
      
      if (elapsed < totalDuration) {
        let position;
        const attackTime = attack;
        const decayTime = decay;
        const sustainTime = 1; // 1초의 서스테인
        
        if (elapsed < attackTime) {
          // 어택 단계
          position = elapsed / totalDuration;
        } else if (elapsed < attackTime + decayTime) {
          // 디케이 단계
          position = (attackTime + (elapsed - attackTime)) / totalDuration;
        } else if (elapsed < attackTime + decayTime + sustainTime) {
          // 서스테인 단계
          position = (attackTime + decayTime + (elapsed - attackTime - decayTime)) / totalDuration;
        } else {
          // 릴리즈 단계
          position = (attackTime + decayTime + sustainTime + (elapsed - attackTime - decayTime - sustainTime)) / totalDuration;
        }
        
        envelopePosition.set(position);
        drawEnvelope();
        animationId = requestAnimationFrame(animate);
      } else {
        isPlaying = false;
        envelopePosition.set(0);
        drawEnvelope();
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    // 릴리즈 단계가 시작될 때 노트 릴리즈
    setTimeout(() => {
      synth.triggerRelease(note);
    }, (attack + decay + 1) * 1000); // 어택 + 디케이 + 1초의 서스테인
  }
  
  function stopNote() {
    synth.triggerRelease(note);
    isPlaying = false;
    cancelAnimationFrame(animationId);
    envelopePosition.set(0);
    drawEnvelope();
  }
</script>

<div class="adsr-container">
  <div class="canvas-container">
    <canvas bind:this={canvas} width={width} height={height}></canvas>
  </div>
  
  <div class="controls">
    <div class="control">
      <label for="attack">어택 (Attack)</label>
      <input type="range" id="attack" min="0.01" max="2" step="0.01" bind:value={attack}>
      <span class="value">{attack.toFixed(2)}s</span>
      <p class="description">소리가 최대 볼륨에 도달하는 데 걸리는 시간</p>
    </div>
    
    <div class="control">
      <label for="decay">디케이 (Decay)</label>
      <input type="range" id="decay" min="0.01" max="2" step="0.01" bind:value={decay}>
      <span class="value">{decay.toFixed(2)}s</span>
      <p class="description">최대 볼륨에서 서스테인 레벨로 감소하는 데 걸리는 시간</p>
    </div>
    
    <div class="control">
      <label for="sustain">서스테인 (Sustain)</label>
      <input type="range" id="sustain" min="0" max="1" step="0.01" bind:value={sustain}>
      <span class="value">{sustain.toFixed(2)}</span>
      <p class="description">키가 눌려 있는 동안 유지되는 볼륨 수준</p>
    </div>
    
    <div class="control">
      <label for="release">릴리즈 (Release)</label>
      <input type="range" id="release" min="0.01" max="3" step="0.01" bind:value={release}>
      <span class="value">{release.toFixed(2)}s</span>
      <p class="description">키를 놓았을 때 소리가 사라지는 데 걸리는 시간</p>
    </div>
  </div>
  
  <div class="play-controls">
    <button on:click={playNote} disabled={isPlaying} class="play-btn">
      소리 재생
    </button>
    <button on:click={stopNote} disabled={!isPlaying} class="stop-btn">
      정지
    </button>
  </div>
  
  <div class="explanation">
    <h3>ADSR이란?</h3>
    <p>
      ADSR은 소리의 시간에 따른 볼륨 변화를 조절하는 엔벨로프의 네 가지 단계를 의미합니다:
    </p>
    <ul>
      <li><strong>어택 (Attack):</strong> 소리가 시작되어 최대 볼륨에 도달하기까지의 시간</li>
      <li><strong>디케이 (Decay):</strong> 최대 볼륨에서 서스테인 레벨로 감소하는 시간</li>
      <li><strong>서스테인 (Sustain):</strong> 키를 누르고 있는 동안 유지되는 볼륨 수준</li>
      <li><strong>릴리즈 (Release):</strong> 키를 놓은 후 소리가 완전히 사라지기까지의 시간</li>
    </ul>
    <p>
      위의 슬라이더를 조절하여 다양한 ADSR 설정이 소리에 어떤 영향을 미치는지 직접 확인해보세요.
      짧은 어택과 릴리즈는 타악기 같은 느낌을, 긴 어택과 릴리즈는 현악기나 패드와 같은 느낌을 만듭니다.
    </p>
  </div>
</div>

<style>
  .adsr-container {
    background: #111;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .canvas-container {
    width: 100%;
    margin-bottom: 1.5rem;
    border: 1px solid #333;
    border-radius: 4px;
    overflow: hidden;
  }
  
  canvas {
    display: block;
    background: #0a0a0a;
  }
  
  .controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .control {
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #fff;
    font-weight: 500;
  }
  
  input[type="range"] {
    margin-bottom: 0.5rem;
    width: 100%;
    accent-color: #5b8fb9;
  }
  
  .value {
    font-size: 0.9rem;
    color: #5b8fb9;
    margin-bottom: 0.5rem;
  }
  
  .description {
    font-size: 0.8rem;
    color: #888;
    margin: 0;
  }
  
  .play-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .play-btn {
    background-color: #5b8fb9;
    color: #fff;
  }
  
  .play-btn:hover:not([disabled]) {
    background-color: #4a759a;
  }
  
  .stop-btn {
    background-color: #777;
    color: #fff;
  }
  
  .stop-btn:hover:not([disabled]) {
    background-color: #666;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .explanation {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 4px;
  }
  
  .explanation h3 {
    margin-top: 0;
    color: #fff;
  }
  
  .explanation p, .explanation li {
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .explanation ul {
    padding-left: 1.2rem;
  }
  
  .explanation li {
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 768px) {
    .controls {
      grid-template-columns: 1fr;
    }
  }
</style>
