<script>
  import NavMenu from '$lib/components/NavMenu.svelte';
  let { children } = $props();
</script>

<svelte:head></svelte:head>

<aside>
  <NavMenu />
</aside>

<main>
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
    main {
      margin-left: 180px;
    }
  }
  main {
    padding: 20px;
  }
</style>
