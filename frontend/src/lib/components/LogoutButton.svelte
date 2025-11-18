<script>
  import { goto } from '$app/navigation';

  async function logout() {
    try {
      const backendUrl = 'http://localhost:3001';
      let response = await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Successfully logged out', response);
        await goto('/login');
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.log(error);
    }
  }
</script>

<button on:click={logout}>Logout</button>

<style>
  button {
    background: #606060;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    display: block;
    padding: 10px 14px;
    text-decoration: none;
    font-size: 0.7em;
  }

  button:hover {
    background: #d66;
  }

  @media (min-width: 800px) {
    button {
      position: fixed;
      bottom: 20px;
      left: 10px;
    }
  }
</style>
