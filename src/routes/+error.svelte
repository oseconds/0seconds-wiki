<script>
  import { goto } from '$app/navigation';
</script>

<div class="not-found">
  <h1>404</h1>
  <h2>페이지를 찾을 수 없습니다</h2>
  <p>
    요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
  </p>
  <div class="actions">
    <button class="home-btn" on:click={() => goto('/')}>홈으로 돌아가기</button>
  </div>
</div>

<style>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5rem 1rem;
  }
  
  h1 {
    font-size: 6rem;
    margin: 0;
    color: #5b8fb9;
  }
  
  h2 {
    font-size: 2rem;
    margin: 0.5rem 0 1.5rem;
    color: #fff;
  }
  
  p {
    font-size: 1.2rem;
    color: #ccc;
    margin-bottom: 2rem;
    max-width: 600px;
  }
  
  .actions {
    margin-top: 1rem;
  }
  
  .home-btn {
    padding: 0.8rem 2rem;
    background-color: #5b8fb9;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .home-btn:hover {
    background-color: #4a759a;
  }
</style>
