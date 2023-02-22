<script>
	import '../app.css';
	import { supabaseClient } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/store/stores';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	supabaseClient.auth.onAuthStateChange((event, session) => {
		console.log('auth state changed');
		console.log(session);
    user.set(session?.user);
	});
</script>

<slot />
