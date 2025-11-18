<script>
  import NavMenu from '$lib/components/NavMenu.svelte';
  import { page } from '$app/stores';

  let { children } = $props();
  const isNotLoginRoute = $derived($page.url.pathname !== '/login');
</script>

<svelte:head></svelte:head>

<aside>
  <NavMenu />
</aside>

<main class:with-sidebar={isNotLoginRoute}>
  {@render children()}
</main>

<style>
  @media (max-width: 799px) {
    main {
      margin-left: 0;
      padding-top: 10px;
    }
  }

  /* otherwise navbar on left */
  @media (min-width: 800px) {
    main.with-sidebar {
      margin-left: 180px;
    }
  }
  main {
    padding: 20px;
  }
</style>
