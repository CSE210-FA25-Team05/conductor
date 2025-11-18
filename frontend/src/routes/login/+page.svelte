<script>
  import { onMount } from 'svelte';
  import GoogleOauthButton from '$lib/components/GoogleOauthButton.svelte';

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

<div class="welcome-box">
  <h1>Conductor</h1>
  <p class='subtitle'>Sign In:</p>
  <div class="google-oauth-container">
    <GoogleOauthButton />
    {#if errorMessage != ''}
      <p>Error: {errorMessage}</p>
    {/if}
  </div>
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

  .welcome-box {
    border: 1px solid #ccc;
    padding: 24px;
    border-radius: 10px;
    width: 300px;
    margin: 40px auto;
    background: #fafafa;
    text-align: center;
  }

  .subtitle {
    margin: 20px;
    font-size: 0.9em;
    color: #555;
  }

  h1 {
    margin: 20px;
  }
</style>
