<!-- filepath: /Users/oyeongseo/Coding/0seconds-wiki/src/lib/components/interactive/p5/GenerativeArt.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import P5Wrapper from './P5Wrapper.svelte';
  import type p5 from 'p5';
  
  // 캔버스 크기
  export let width: number = 800;
  export let height: number = 600;
  
  // 색상 팔레트
  export let colorPalette: string[] = [
    '#ff0080', '#ff8000', '#80ff00', '#00ff80', '#0080ff', '#8000ff'
  ];
  
  // 패턴 유형
  export let patternType: 'particles' | 'flow-field' | 'recursive' = 'particles';
  
  // p5 인스턴스
  let p5Instance: p5;
  
  // 파티클 설정
  class Particle {
    p5: p5;
    pos: p5.Vector;
    vel: p5.Vector;
    acc: p5.Vector;
    color: string;
    size: number;
    history: p5.Vector[];
    maxHistory: number;
    
    constructor(p: p5, x: number, y: number, color: string) {
      this.p5 = p;
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
      this.vel.mult(p.random(0.5, 2));
      this.acc = p.createVector(0, 0);
      this.color = color;
      this.size = p.random(2, 8);
      this.history = [];
      this.maxHistory = Math.floor(p.random(5, 30));
    }
    
    update() {
      // 가속도 및 속도 업데이트
      this.vel.add(this.acc);
      this.vel.limit(5);
      this.pos.add(this.vel);
      this.acc.mult(0);
      
      // 위치 기록
      this.history.push(this.p5.createVector(this.pos.x, this.pos.y));
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      
      // 경계 확인
      this.edges();
    }
    
    applyForce(force: p5.Vector) {
      this.acc.add(force);
    }
    
    edges() {
      const { p5: p } = this;
      
      if (this.pos.x > width) {
        this.pos.x = 0;
        this.history = [];
      }
      if (this.pos.x < 0) {
        this.pos.x = width;
        this.history = [];
      }
      if (this.pos.y > height) {
        this.pos.y = 0;
        this.history = [];
      }
      if (this.pos.y < 0) {
        this.pos.y = height;
        this.history = [];
      }
    }
    
    follow(flowfield: p5.Vector[][]) {
      // 플로우 필드에 따라 이동
      const x = Math.floor(this.pos.x / 20);
      const y = Math.floor(this.pos.y / 20);
      
      if (x >= 0 && x < flowfield.length && y >= 0 && y < flowfield[0].length) {
        const force = flowfield[x][y].copy();
        this.applyForce(force);
      }
    }
    
    display() {
      const { p5: p } = this;
      
      // 움직임 궤적 그리기
      p.noFill();
      p.stroke(this.color + '80'); // 반투명
      p.beginShape();
      for (let i = 0; i < this.history.length; i++) {
        const pos = this.history[i];
        p.vertex(pos.x, pos.y);
      }
      p.endShape();
      
      // 파티클 그리기
      p.fill(this.color);
      p.noStroke();
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }
  
  // 플로우 필드 스케치
  const flowFieldSketch = (p: p5) => {
    let particles: Particle[] = [];
    let flowField: p5.Vector[][] = [];
    let cols: number, rows: number;
    let zoff = 0;
    
    p.setup = () => {
      p.createCanvas(width, height);
      p.background(15);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      
      // 플로우 필드 그리드 설정
      cols = Math.floor(width / 20);
      rows = Math.floor(height / 20);
      
      // 플로우 필드 초기화
      flowField = new Array(cols);
      for (let i = 0; i < cols; i++) {
        flowField[i] = new Array(rows);
      }
      
      // 파티클 생성
      for (let i = 0; i < 200; i++) {
        const color = colorPalette[Math.floor(p.random(colorPalette.length))];
        particles.push(new Particle(p, p.random(width), p.random(height), color));
      }
    };
    
    p.draw = () => {
      p.background(15, 10); // 약간의 잔상 효과
      
      // 플로우 필드 업데이트
      let xoff = 0;
      for (let i = 0; i < cols; i++) {
        let yoff = 0;
        for (let j = 0; j < rows; j++) {
          // 펄린 노이즈로 각도 생성
          const angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 2;
          
          // 각도에 따른 벡터 생성
          const v = p.createVector(p.cos(angle), p.sin(angle));
          v.mult(0.5); // 힘 조절
          flowField[i][j] = v;
          
          yoff += 0.1;
        }
        xoff += 0.1;
      }
      zoff += 0.01;
      
      // 파티클 업데이트 및 표시
      for (const particle of particles) {
        particle.follow(flowField);
        particle.update();
        particle.display();
      }
      
      // 마우스 인터랙션
      if (p.mouseIsPressed) {
        for (let i = 0; i < 3; i++) {
          const color = colorPalette[Math.floor(p.random(colorPalette.length))];
          particles.push(new Particle(p, p.mouseX, p.mouseY, color));
          
          // 파티클이 너무 많아지면 오래된 것 제거
          if (particles.length > 500) {
            particles.splice(0, 3);
          }
        }
      }
    };
    
    p.mouseClicked = () => {
      // 클릭 시 새 파티클 추가
      for (let i = 0; i < 10; i++) {
        const color = colorPalette[Math.floor(p.random(colorPalette.length))];
        particles.push(new Particle(p, p.mouseX, p.mouseY, color));
      }
    };
    
    p.keyPressed = () => {
      // 스페이스바 누르면 화면 초기화
      if (p.keyCode === 32) {
        p.background(15);
        particles = [];
        for (let i = 0; i < 200; i++) {
          const color = colorPalette[Math.floor(p.random(colorPalette.length))];
          particles.push(new Particle(p, p.random(width), p.random(height), color));
        }
      }
    };
  };
  
  // 파티클 시스템 스케치
  const particleSystemSketch = (p: p5) => {
    let particles: Particle[] = [];
    
    p.setup = () => {
      p.createCanvas(width, height);
      p.background(15);
      
      // 초기 파티클 생성
      for (let i = 0; i < 50; i++) {
        const color = colorPalette[Math.floor(p.random(colorPalette.length))];
        particles.push(new Particle(p, p.random(width), p.random(height), color));
      }
    };
    
    p.draw = () => {
      p.background(15, 20); // 잔상 효과
      
      // 파티클 업데이트 및 표시
      for (const particle of particles) {
        // 마우스 위치를 향한 힘 적용
        if (p.mouseIsPressed) {
          const mousePos = p.createVector(p.mouseX, p.mouseY);
          const dir = p5.Vector.sub(mousePos, particle.pos);
          dir.normalize();
          dir.mult(0.5);
          particle.applyForce(dir);
        }
        
        // 랜덤 움직임 추가
        const randForce = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
        particle.applyForce(randForce);
        
        particle.update();
        particle.display();
      }
      
      // 마우스 드래그 시 파티클 추가
      if (p.mouseIsPressed) {
        for (let i = 0; i < 2; i++) {
          const color = colorPalette[Math.floor(p.random(colorPalette.length))];
          particles.push(new Particle(p, p.mouseX + p.random(-20, 20), p.mouseY + p.random(-20, 20), color));
          
          // 파티클이 너무 많아지면 오래된 것 제거
          if (particles.length > 300) {
            particles.splice(0, 2);
          }
        }
      }
    };
  };
  
  // 재귀적 패턴 스케치
  const recursiveSketch = (p: p5) => {
    let angleOffset = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    p.setup = () => {
      p.createCanvas(width, height);
      p.background(15);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noFill();
      p.strokeWeight(1);
    };
    
    function drawBranch(x: number, y: number, angle: number, len: number, depth: number, colorIndex: number) {
      if (len < 4 || depth > 6) return;
      
      // 색상 선택
      const col = colorPalette[colorIndex % colorPalette.length];
      p.stroke(col + Math.floor(30 + 30 * Math.sin(p.frameCount * 0.05)).toString(16));
      
      // 브랜치 끝점 계산
      const endX = x + p.cos(angle) * len;
      const endY = y + p.sin(angle) * len;
      
      // 선 그리기
      p.line(x, y, endX, endY);
      
      // 새 브랜치 각도 계산 (마우스 위치에 따라 변화)
      const mouseInfluence = p.map(p.mouseX, 0, width, -0.2, 0.2);
      const splitAngle = p.PI / 6 + mouseInfluence + p.sin(angleOffset) * 0.2;
      
      // 재귀 호출
      drawBranch(endX, endY, angle - splitAngle, len * 0.75, depth + 1, colorIndex + 1);
      drawBranch(endX, endY, angle + splitAngle, len * 0.75, depth + 1, colorIndex + 2);
    }
    
    p.draw = () => {
      p.background(15, 15); // 약한 잔상 효과
      
      // 마우스 위치에 따라 패턴 변화
      const dx = p.mouseX - lastMouseX;
      const dy = p.mouseY - lastMouseY;
      angleOffset += (dx + dy) * 0.01;
      lastMouseX = p.mouseX;
      lastMouseY = p.mouseY;
      
      // 여러 위치에서 프랙탈 그리기
      const baseLen = p.map(p.sin(angleOffset * 0.3), -1, 1, 50, 100);
      
      // 중앙 패턴
      drawBranch(width / 2, height * 0.8, -p.PI / 2 + p.sin(angleOffset) * 0.2, baseLen, 0, 0);
      
      // 측면 패턴 (마우스가 눌려 있을 때만)
      if (p.mouseIsPressed) {
        drawBranch(width * 0.25, height * 0.8, -p.PI / 2 + p.cos(angleOffset) * 0.3, baseLen * 0.8, 0, 2);
        drawBranch(width * 0.75, height * 0.8, -p.PI / 2 + p.sin(angleOffset) * 0.3, baseLen * 0.8, 0, 4);
      }
    };
    
    p.mousePressed = () => {
      // 클릭 시 새로운 시드로 패턴 초기화
      angleOffset = p.random(p.TWO_PI);
    };
  };
  
  // 패턴 유형에 따른 스케치 선택
  $: sketch = patternType === 'flow-field' ? flowFieldSketch : 
               patternType === 'recursive' ? recursiveSketch : 
               particleSystemSketch;
</script>

<div class="generative-art">
  <P5Wrapper {sketch} {width} {height} bind:p5Instance />
  
  <div class="controls">
    <div class="pattern-selector">
      <label>
        <input type="radio" bind:group={patternType} value="particles">
        <span>파티클 시스템</span>
      </label>
      
      <label>
        <input type="radio" bind:group={patternType} value="flow-field">
        <span>플로우 필드</span>
      </label>
      
      <label>
        <input type="radio" bind:group={patternType} value="recursive">
        <span>재귀 패턴</span>
      </label>
    </div>
  </div>
  
  <div class="hint">
    <p>🖱️ 마우스로 화면을 클릭하거나 드래그해보세요! 스페이스바를 누르면 초기화됩니다.</p>
  </div>
</div>

<style>
  .generative-art {
    background: #111;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .controls {
    margin: 1rem 0;
    display: flex;
    justify-content: center;
  }
  
  .pattern-selector {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ccc;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
    transition: background-color 0.2s;
  }
  
  label:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  input[type="radio"] {
    accent-color: #ff0080;
  }
  
  .hint {
    text-align: center;
    margin-top: 0.5rem;
    font-style: italic;
    opacity: 0.7;
    color: #ccc;
  }
  
  @media (max-width: 768px) {
    .pattern-selector {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }
  }
</style>
