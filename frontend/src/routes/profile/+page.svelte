<script>
  import { onMount } from 'svelte';

  let firstName = '';
  let lastName = '';
  let email = '';
  let pronouns = '';
  let otherPronounsValue = '';
  let loading = true;
  let error = null;

  const availablePronouns = [
    'He/Him',
    'She/Her',
    'They/Them',
    'Prefer not to say',
    'Other',
  ];

  let showOtherPronounsInput = false;

  $: showOtherPronounsInput = pronouns === 'Other';

  async function fetchProfile() {
    loading = true;
    error = null;

    try {
      const response = await fetch('http://localhost:3001/me', {
          credentials: 'include', 
      });

      const data = await response.json();

      // Populate form fields with fetched data
      firstName = data.first_name || '';
      lastName = data.last_name || '';
      email = data.email || '';

      // Handle pronouns: if it's one of the standard ones, select it.
      // Otherwise, assume it's a custom 'Other' value.
      if (availablePronouns.includes(data.pronouns)) {
        pronouns = data.pronouns;
      } else if (data.pronouns) {
        pronouns = 'Other';
        otherPronounsValue = data.pronouns;
      } else {
        pronouns = ''; // Default to blank if no pronouns
      }
    } catch (e) {
      console.error('Failed to fetch profile:', e);
      error = e.message;
    } finally {
      loading = false;
    }
  }

  // Function to submit the profile updates
  async function handleSubmit() {
    loading = true;
    error = null;

    const payload = {
      firstName,
      lastName,
      pronouns: showOtherPronounsInput ? otherPronounsValue : pronouns,
    };

    try {
      const response = await fetch('http://localhost:3001/me/profile', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized or Forbidden. Please log in again.');
        }
        const errData = await response.json();
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
    } catch (e) {
      console.error('Failed to update profile:', e);
      error = e.message;
    } finally {
      loading = false;
    }
  }

  // Fetch profile data when the component is first mounted
  onMount(() => {
    fetchProfile();
  });

</script>

<section>
  <h1>Your Profile</h1>

  {#if error}
    <p class="error-message">Error: {error}</p>
    <button on:click={fetchProfile}>Retry Loading Profile</button>
  {:else}
    <form on:submit|preventDefault={handleSubmit}>
      <div>
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" bind:value={firstName} required />
      </div>

      <div>
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" bind:value={lastName} required />
      </div>

      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" bind:value={email} required />
      </div>


      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  {/if}
</section>
