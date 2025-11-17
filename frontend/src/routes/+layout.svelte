<script>
    import NavMenu from '$lib/components/NavMenu.svelte'
    let { children } = $props();
</script>

<svelte:head>
</svelte:head>

<aside>
    <NavMenu/>
</aside>

<main>
    {@render children()}
</main>
