<script lang="ts">
  import { onMount } from 'svelte';
  import P5Wrapper from './P5Wrapper.svelte';
  import type p5 from 'p5';

  // 파라미터
  export let particleCount = 100;
  export let particleSpeed = 2;
  export let particleSize = 5;
  export let colorMode = 'rainbow'; // rainbow, monochrome, custom
  export let backgroundColor = '#121212';
  export let lineOpacity = 0.2;
  export let noiseScale = 0.01;
  export let noiseStrength = 1;
  export let customColors = ['#FF5722', '#03A9F4', '#4CAF50', '#FFC107', '#9C27B0'];
  
  let p5Instance: p5;
  let width = 800;
  let height = 600;
  
  let startX = 0;
  let startY = 0;
  let isMousePressed = false;

  // 반응형을 위한 리사이즈
  function handleResize() {
    const container = document.querySelector('.generative-wrapper');
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
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // p5.js 스케치 정의
  const sketch = (p: p5) => {
    // 파티클 클래스 정의
    class Particle {
      pos: p5.Vector;
      vel: p5.Vector;
      acc: p5.Vector;
      color: p5.Color;
      size: number;
      id: number;
      
      constructor(id: number) {
        this.pos = p.createVector(p.random(width), p.random(height));
        this.vel = p5.Vector.random2D().mult(p.random(0.5, 1.5) * particleSpeed / 10);
        this.acc = p.createVector(0, 0);
        this.id = id;
        this.size = p.random(particleSize * 0.5, particleSize * 1.5);
        
        if (colorMode === 'rainbow') {
          this.color = p.color(p.random(360), 80, 90, 0.8);
        } else if (colorMode === 'monochrome') {
          this.color = p.color(220, 20, p.random(50, 90), 0.8);
        } else {
          const randomColor = customColors[Math.floor(p.random(customColors.length))];
          this.color = p.color(randomColor);
        }
      }
      
      update() {
        // 노이즈 기반 이동
        const angle = p.noise(
          this.pos.x * noiseScale, 
          this.pos.y * noiseScale
        ) * p.TWO_PI * noiseStrength;
        
        const noiseForce = p5.Vector.fromAngle(angle);
        noiseForce.mult(0.1 * particleSpeed);
        this.acc.add(noiseForce);
        
        // 마우스 상호작용
        if (isMousePressed) {
          const mouse = p.createVector(startX, startY);
          const dir = p5.Vector.sub(mouse, this.pos);
          const d = dir.mag();
          
          if (d < 200) {
            dir.normalize();
            dir.mult(0.5 * particleSpeed);
            this.acc.add(dir);
          }
        }
        
        this.vel.add(this.acc);
        this.vel.limit(3 * particleSpeed / 10);
        this.pos.add(this.vel);
        this.acc.mult(0);
        
        // 화면 가장자리 처리
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
      }
      
      draw() {
        p.fill(this.color);
        p.noStroke();
        p.ellipse(this.pos.x, this.pos.y, this.size);
      }
      
      connect(particles: Particle[]) {
        particles.forEach(other => {
          if (this.id !== other.id) {
            const d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            if (d < 100) {
              p.stroke(p.red(this.color), p.green(this.color), p.blue(this.color), lineOpacity * 255);
              p.line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            }
          }
        });
      }
    }
    
    let particles: Particle[] = [];
    
    p.setup = () => {
      p.createCanvas(width, height);
      p.colorMode(p.HSB, 360, 100, 100, 1);
      
      // 파티클 생성
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(i));
      }
    };
    
    p.draw = () => {
      p.background(backgroundColor);
      
      // 파티클 업데이트 및 표시
      particles.forEach(particle => {
        particle.update();
      });
      
      // 파티클 연결선 그리기 (먼저 그려서 파티클 위에 표시되지 않도록)
      particles.forEach(particle => {
        particle.connect(particles);
      });
      
      // 파티클 그리기
      particles.forEach(particle => {
        particle.draw();
      });
    };
    
    p.mousePressed = () => {
      isMousePressed = true;
      startX = p.mouseX;
      startY = p.mouseY;
    };
    
    p.mouseReleased = () => {
      isMousePressed = false;
    };
    
    p.mouseDragged = () => {
      startX = p.mouseX;
      startY = p.mouseY;
    };
    
    // 파라미터 변경 감지 및 재설정 함수
    p.updateParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(i));
      }
    };
  };
  
  // 파라미터 변경 시 파티클 재생성
  $: if (p5Instance && p5Instance.updateParticles) {
    p5Instance.updateParticles();
  }
</script>

<div class="generative-wrapper">
  <P5Wrapper {sketch} {width} {height} bind:p5Instance />
</div>

<style>
  .generative-wrapper {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
