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
	function listTodayEvents(){
		listEvents(todayDate,tomorrowDate,'primary');
	}
</script>

<Auth />

{#if $page.data.session?.user}
	<div class="flex min-h-screen flex-col items-center justify-start gap-16 p-16">
		<div class="flex h-20 w-full flex-row items-center justify-evenly gap-16">
			<div
				class="flex h-full flex-[1] items-center justify-start rounded-xl bg-gradient-to-r from-neutral-300 to-stone-400 p-4"
			>
				<h1 class="text-2xl ">LAST 7 DAYS</h1>
			</div>
			<div
				class="flex h-full flex-[3] items-center justify-start rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 p-4"
			>
				<h1 class="text-3xl ">Dashboard</h1>
			</div>
		</div>
		<div class="flex w-full flex-row items-start justify-evenly gap-16">
			<div class="flex h-full flex-[1]">
				{#if loaded}
					<Projects />
					<TaskView />
				{/if}
			</div>
			<div
				class="flex min-h-full flex-[1] flex-col items-center justify-start rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 p-4"
			>
				<h2 class="text-2xl">Timeline</h2>
				<!-- <Timeline bind:events={todayEvents} bind:todayDate /> -->
			</div>
			<div
				class="flex min-h-full flex-[1] flex-col items-center justify-start rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 p-4"
			>
			<button id="list_events" on:click={listTodayEvents}>List Events</button>
				<h2 class="text-2xl ">Upcoming Tasks</h2>
				<CalendarView />
			</div>
		</div>
	</div>
{/if}
