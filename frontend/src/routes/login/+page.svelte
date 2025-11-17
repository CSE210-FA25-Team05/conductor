<script>
  import { onMount } from 'svelte';
  import GoogleOauthButton from '$lib/components/GoogleOauthButton.svelte'

  let errorMessage = $state('');

  onMount(() => {
    // Check for error parameters
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error) {
      errorMessage = decodeURIComponent(error);
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, document.title, url.toString());
    }
  });
</script>

<div class="google-oauth-container">
    <GoogleOauthButton />
    {#if errorMessage != ''}
        <p>Error: {errorMessage}</p>
    {/if}
</div>

<style>
  .google-oauth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .error-message {
    width: 100%;
  }
</style>
