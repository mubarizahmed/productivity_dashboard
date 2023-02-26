<script lang="ts">
	import Auth from '$lib/components/auth/Auth.svelte';
	import TaskView from '$lib/components/task/TaskView.svelte';
	// import GoogleAuth from '$lib/components/calendar/GoogleAuth.svelte';
	import CalendarView from '$lib/components/calendar/CalendarView.svelte';
	import Timeline from '$lib/components/timeline/Timeline.svelte';
	import Projects from '$lib/components/projects/Projects.svelte';
	import { user } from '$lib/store/stores';
	import { projectStore } from '$lib/store/projectStore';
	import { page } from '$app/stores';
	import { eventStore } from '$lib/store/eventStore';
	import { listEvents } from '$lib/functions/GCal';
	import Current from '$lib/components/current/Current.svelte';
	import Lastweek from '$lib/components/lastweek/Lastweek.svelte';
	let loadedEvents = new Array<Object>();
	let todayEvents = new Array<Object>();
	let todayDate = new Date();
	todayDate.setHours(0, 0, 0, 0);
	console.log(todayDate);
	// get tommorow's date
	let tomorrowDate = new Date(todayDate);
	tomorrowDate.setDate(tomorrowDate.getDate() + 1);
	let loaded = false;

	$: console.log($page.data);
	// on auth
	$: {
		if ($page.data.session?.user) {
			user.set($page.data.session?.user);
			eventStore.clear();
			projectStore.loadProjects().then(() => {
				eventStore.loadEvents().then(() => {
					loaded = true;
				});
			});
			eventStore.loadCalendarEvents();
		}
	}
	function listTodayEvents() {
		eventStore.loadCalendarEvents();
	}
</script>

<div
	class="ml-12 flex min-h-screen w-full  flex-col items-center justify-start gap-8 bg-rich-black p-8"
>
	<div class="flex h-32 w-full flex-row items-center justify-evenly gap-8">
		<Lastweek />
		<div
			class="flex h-full flex-[1] items-center justify-center rounded-xl  p-4 "
		>
			<h1 class="text-2xl text-cool-gray ">Welcome, {$user.user_metadata.full_name.split(" ")[0]}</h1>
		</div>
		<Current />
	</div>
	<div class="flex w-full flex-row items-start justify-evenly gap-8">
		{#if loaded}
			<TaskView />

			<Timeline />

			<div
				class="flex min-h-full flex-[1] flex-col items-center justify-start rounded-xl border-2 border-space-cadet bg-rich-black-2 p-4 drop-shadow-2xl"
			/>
		{/if}
	</div>
</div>
