<script type="ts">
	import { supabaseClient } from '$lib/supabaseClient';
	import { page } from '$app/stores';

	let loading = false;
	let email;

	function googleSignIn() {
		try {
			loading = true;
			const error = supabaseClient.auth.signInWithOAuth({
				provider: 'google',
				options: { scopes: 'https://www.googleapis.com/auth/calendar', access_type: 'offline' }
			});
			console.log('logged in ', $page);
			if (error) throw error;
		} catch (error) {
			console.log('error', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex-column w-full h-full items-center justify-center bg-rich-black">
	<h1 class="text-center text-white text-2xl font-bold">Log In</h1>
	<button
		class="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
		on:click={googleSignIn}
		disabled={loading}
	>
		{#if loading}
			Loading...
		{:else}
			Log In with Google
		{/if}
	</button>


</div>
