<script>
	import TaskView from '$lib/components/task/TaskView.svelte';
	// import GoogleAuth from '$lib/components/calendar/GoogleAuth.svelte';
	import CalendarView from '$lib/components/calendar/CalendarView.svelte';
</script>

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
		<div class="flex flex-[1] h-full">
			<TaskView />
		</div>
		<div
			class="flex-[1] flex min-h-full flex-col items-center justify-start rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 p-4"
		>
			<h2 class="text-2xl">Timeline</h2>
		</div>
    <div
    class="flex-[1] flex min-h-full flex-col items-center justify-start rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 p-4"
  >
    <h2 class="text-2xl ">Upcoming Tasks</h2>
		<CalendarView />


  </div>
	</div>
</div>
