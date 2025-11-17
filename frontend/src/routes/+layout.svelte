<script>
    import LogoutButton from '$lib/components/LogoutButton.svelte';
	let { children } = $props();
</script>

<svelte:head>
</svelte:head>

<nav>
    <li> <a href="/">Home</a> </li>
    <li> <LogoutButton/> </li>
<script>
</script>
</nav>

{@render children()}
