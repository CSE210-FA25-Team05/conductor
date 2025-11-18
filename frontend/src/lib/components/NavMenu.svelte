<script>
  import { page } from '$app/stores';
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  $: isNotLoginRoute = $page.url.pathname !== '/login';
</script>

{#if isNotLoginRoute}
  <nav>
    <li><a href="/">Home</a></li>
    <li><a href="/profile">Profile</a></li>
    <li><a href="/atoms">Atoms</a></li>
    <li><LogoutButton /></li>
  </nav>
{/if}

<style>
  /* navbar to top when screen under 800p wide */
  @media (max-width: 799px) {
    nav {
      flex-direction: row;
      position: relative;
      width: 100%;
      height: auto;
      padding: 10px 20px;
      border-right: none;
      border-bottom: 1px solid #ddd;
      background: #f5f5f5;
    }
  }
  @media (min-width: 800px) {
    nav {
      flex-direction: column;
      position: fixed;
      width: 0;
      padding: 0;
      border: none;
      overflow: hidden;
      top: 0;
      left: 0;

      width: 180px;
      height: 100vh;

      background: #f5f5f5;
      border-right: 1px solid #ddd;

      padding: 20px;
      box-sizing: border-box;
    }
  }
  nav {
    list-style: none;
    display: flex;
    gap: 12px;
    padding: 0;
  }
  nav a {
    display: block;
    padding: 10px 14px;
    background: #f0f0f0;
    border-radius: 6px;
    text-decoration: none;
    color: #333;
    font-weight: 500;
    font-size: 0.9em;
  }
  nav a:hover {
    background: #e0e0e0;
  }
</style>
