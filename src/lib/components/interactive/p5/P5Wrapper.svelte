<!-- filepath: /Users/oyeongseo/Coding/0seconds-wiki/src/lib/components/interactive/p5/P5Wrapper.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import p5 from 'p5/lib/p5.min.js';
  
  // p5.js 스케치 함수
  export let sketch: (p: p5) => void;
  
  // 캔버스 크기
  export let width: number = 500;
  export let height: number = 500;
  
  // 외부에서 p5 인스턴스에 접근할 수 있도록 저장
  export let p5Instance: p5;
  
  let container: HTMLDivElement;
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      // p5 인스턴스 생성
      p5Instance = new p5(sketch, container);
      
      // 기본 스타일 적용
      if (container.firstChild) {
        const canvas = container.firstChild as HTMLCanvasElement;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
      }
    }
  });
  
  onDestroy(() => {
    if (p5Instance) {
      p5Instance.remove();
    }
  });
</script>

<div 
  bind:this={container} 
  class="p5-wrapper"
  style="width: {width}px; height: {height}px;"
>
</div>

<style>
  .p5-wrapper {
    position: relative;
    margin: 0 auto;
    background: #000;
    overflow: hidden;
    border-radius: 8px;
  }
</style>
