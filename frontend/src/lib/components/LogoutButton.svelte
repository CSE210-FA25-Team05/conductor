<script>
    import { goto } from '$app/navigation';

    async function logout() {
        try {
            const backendUrl = 'http://localhost:3001';
            let response = await fetch(`${backendUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
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
