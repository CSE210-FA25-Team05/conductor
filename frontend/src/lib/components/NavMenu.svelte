<script>
  import { page } from '$app/stores';
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  $: isNotLoginRoute = $page.url.pathname !== '/login';
</script>


{ #if isNotLoginRoute }
    <nav>
        <li><a href="/">Home</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><LogoutButton/></li>
    </nav>
{/if}

