<script lang="ts">
  import ADSREnvelope from '$lib/components/interactive/ADSREnvelope.svelte';
</script>

<svelte:head>
  <title>ADSR 엔벨로프 데모 | 0seconds Wiki</title>
  <meta name="description" content="ADSR 엔벨로프 파라미터를 직접 조절해보고 소리의 변화를 경험해보세요." />
</svelte:head>

<div class="adsr-demo-page">
  <header>
    <h1>ADSR 엔벨로프 실험실</h1>
    <p>
      소리의 시작(어택), 감소(디케이), 지속(서스테인), 종료(릴리즈) 단계를 조절하며
      음색의 변화를 직접 체험해보세요.
    </p>
  </header>

  <section class="demo-section">
    <ADSREnvelope />
  </section>

  <section class="info-section">
    <h2>ADSR 엔벨로프의 활용</h2>
    
    <div class="info-grid">
      <div class="info-card">
        <h3>타악기 소리</h3>
        <p>
          짧은 어택과 짧은 디케이, 낮은 서스테인, 짧은 릴리즈 설정은 
          드럼이나 타악기와 같은 짧고 뚜렷한 소리를 만듭니다.
        </p>
        <button class="preset-btn" on:click={() => {
          const adsr = document.querySelector('adsr-envelope');
          // 여기에 프리셋 적용 코드를 추가할 수 있습니다
        }}>타악기 프리셋 적용</button>
      </div>
      
      <div class="info-card">
        <h3>현악기 소리</h3>
        <p>
          중간 정도의 어택, 긴 디케이, 중간 정도의 서스테인, 긴 릴리즈 설정은
          바이올린이나 첼로와 같은 현악기 소리를 표현합니다.
        </p>
        <button class="preset-btn" on:click={() => {
          // 여기에 프리셋 적용 코드를 추가할 수 있습니다
        }}>현악기 프리셋 적용</button>
      </div>
      
      <div class="info-card">
        <h3>패드 사운드</h3>
        <p>
          긴 어택, 긴 디케이, 높은 서스테인, 매우 긴 릴리즈 설정은
          신디사이저 패드와 같은 부드럽고 길게 지속되는 소리를 만듭니다.
        </p>
        <button class="preset-btn" on:click={() => {
          // 여기에 프리셋 적용 코드를 추가할 수 있습니다
        }}>패드 프리셋 적용</button>
      </div>
      
      <div class="info-card">
        <h3>금관악기 소리</h3>
        <p>
          빠른 어택, 중간 디케이, 높은 서스테인, 중간 릴리즈 설정은
          트럼펫이나 트롬본과 같은 금관악기 소리를 표현합니다.
        </p>
        <button class="preset-btn" on:click={() => {
          // 여기에 프리셋 적용 코드를 추가할 수 있습니다
        }}>금관악기 프리셋 적용</button>
      </div>
    </div>
  </section>
  
  <section class="theory-section">
    <h2>이론적 배경</h2>
    
    <div class="theory-content">
      <p>
        ADSR 엔벨로프는 1960년대에 Robert Moog가 개발한 아날로그 신디사이저에서 처음 널리 사용되기 시작했습니다. 
        이 제어 방식은 자연의 소리가 가진 볼륨 특성을 모방하기 위해 개발되었습니다.
      </p>
      
      <div class="theory-columns">
        <div>
          <h3>실제 악기의 ADSR 특성</h3>
          <p>
            실제 악기들은 저마다 고유한 ADSR 특성을 가지고 있습니다:
          </p>
          <ul>
            <li><strong>피아노</strong>: 빠른 어택, 중간 디케이, 낮은 서스테인, 중간-긴 릴리즈</li>
            <li><strong>기타</strong>: 빠른 어택, 중간 디케이, 중간 서스테인, 중간 릴리즈</li>
            <li><strong>바이올린</strong>: 중간 어택, 적은 디케이, 높은 서스테인, 중간 릴리즈</li>
            <li><strong>플루트</strong>: 중간 어택, 적은 디케이, 높은 서스테인, 짧은 릴리즈</li>
            <li><strong>드럼</strong>: 매우 빠른 어택, 중간 디케이, 매우 낮은 서스테인, 다양한 릴리즈</li>
          </ul>
        </div>
        
        <div>
          <h3>음악 장르별 ADSR 활용</h3>
          <p>
            음악 장르에 따라 ADSR 설정이 다르게 활용됩니다:
          </p>
          <ul>
            <li><strong>앰비언트</strong>: 긴 어택, 긴 릴리즈로 공간감 있는 소리 생성</li>
            <li><strong>테크노</strong>: 짧고 날카로운 어택, 낮은 서스테인으로 리드미컬한 소리 생성</li>
            <li><strong>EDM</strong>: 빠른 어택, 중간 디케이로 강한 리드 사운드 생성</li>
            <li><strong>힙합</strong>: 짧은 어택, 중간 디케이, 중간 서스테인으로 묵직한 베이스라인 생성</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  
  <section class="further-reading">
    <h2>더 알아보기</h2>
    <div class="link-cards">
      <a href="/synth/basics" class="link-card">
        <h3>신디사이저 기초</h3>
        <p>신디사이저의 기본 구성 요소와 작동 원리에 대해 알아봅니다.</p>
      </a>
      
      <a href="/effects/filter" class="link-card">
        <h3>필터 이해하기</h3>
        <p>소리의 특정 주파수를 조절하는 필터의 원리와 종류를 탐구합니다.</p>
      </a>
      
      <a href="/demos/waveform" class="link-card">
        <h3>파형 탐색기</h3>
        <p>다양한 파형(사인, 사각, 톱니, 삼각)을 시각적으로 확인하고 소리를 비교해봅니다.</p>
      </a>
      
      <a href="/production/sound-design" class="link-card">
        <h3>사운드 디자인 기법</h3>
        <p>ADSR 엔벨로프와 다른 요소들을 조합하여 다양한 소리를 만드는 방법을 배웁니다.</p>
      </a>
    </div>
  </section>
</div>

<style>
  .adsr-demo-page {
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
    max-width: 700px;
  }
  
  .demo-section {
    margin-bottom: 3rem;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
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
  
  .info-section {
    margin-bottom: 3rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
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
    margin-bottom: 1.5rem;
  }
  
  .preset-btn {
    background-color: transparent;
    border: 1px solid #5b8fb9;
    color: #5b8fb9;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .preset-btn:hover {
    background-color: rgba(91, 143, 185, 0.1);
  }
  
  .theory-section {
    margin-bottom: 3rem;
  }
  
  .theory-content {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .theory-columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
  }
  
  .theory-content h3 {
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 1rem;
    color: #fff;
  }
  
  .theory-content p {
    color: #ccc;
    margin-bottom: 1rem;
  }
  
  .theory-content ul {
    color: #ccc;
    padding-left: 1.5rem;
  }
  
  .theory-content li {
    margin-bottom: 0.5rem;
  }
  
  .further-reading {
    margin-bottom: 3rem;
  }
  
  .link-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
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
    .theory-columns {
      grid-template-columns: 1fr;
    }
  }
</style>
