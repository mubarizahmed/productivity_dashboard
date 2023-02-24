<script lang="ts">
	import Icon from '@iconify/svelte';
	import Task from '$lib/components/task/Task.svelte';

	import type { EventType } from '$lib/types/types';
	import { eventStore, todayTasks } from '$lib/store/eventStore';
	import { projectStore } from '$lib/store/projectStore';

	let add = false;
	let addText = '';

	// Handlers
	function editTask(event: CustomEvent<{ event: EventType }>) {
		console.log('editTask', event);
		eventStore.editTask(event.detail.event);
	}
	function deleteTask(event: CustomEvent<{ eventId: string }>) {
		console.log('deleteTask', event.detail.eventId);
		eventStore.deleteTask(event.detail.eventId);
	}
	function completeTask(event: CustomEvent<{ event: EventType }>) {
		console.log('completeTask', event.detail.event);
		eventStore.completeTask(event.detail.event);
	}
	// toggle add
	function toggleAdd() {
		add = !add;
	}

	// add task
	function addTask() {
		console.log('addTask', addText);
		eventStore.addTask({ name: addText, id: 'newTask' });
		addText = '';
		toggleAdd();
	}

	$: console.log('todayTasks', $todayTasks);
</script>

<div
	class="flex h-full w-full flex-col items-start gap-2 rounded-xl border-2 border-space-cadet bg-rich-black-2 p-4 text-cool-gray drop-shadow-2xl"
>
	<div class="flex w-full flex-row items-center justify-between">
		<!--  -->
		<a
			href="https://todoist.com/app/upcoming"
			target="_blank"
			rel="noopener noreferrer"
			class="h-max"
		>
			<!-- <img src={TodoistIcon} class="h-6 w-6 hover:fill-[#e44332]" /> -->
			<svg
				class="h-6 w-6 fill-cool-gray hover:fill-[#e44332]"
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><title>Todoist</title><path
					d="M21 0H3C1.35 0 0 1.35 0 3v3.858s3.854 2.24 4.098 2.38c.31.18.694.177 1.004 0 .26-.147 8.02-4.608 8.136-4.675.279-.161.58-.107.748-.01.164.097.606.348.84.48.232.134.221.502.013.622l-9.712 5.59c-.346.2-.69.204-1.048.002C3.478 10.907.998 9.463 0 8.882v2.02l4.098 2.38c.31.18.694.177 1.004 0 .26-.147 8.02-4.609 8.136-4.676.279-.16.58-.106.748-.008.164.096.606.347.84.48.232.133.221.5.013.62-.208.121-9.288 5.346-9.712 5.59-.346.2-.69.205-1.048.002C3.478 14.951.998 13.506 0 12.926v2.02l4.098 2.38c.31.18.694.177 1.004 0 .26-.147 8.02-4.609 8.136-4.676.279-.16.58-.106.748-.009.164.097.606.348.84.48.232.133.221.502.013.622l-9.712 5.59c-.346.199-.69.204-1.048.001C3.478 18.994.998 17.55 0 16.97V21c0 1.65 1.35 3 3 3h18c1.65 0 3-1.35 3-3V3c0-1.65-1.35-3-3-3z"
				/></svg
			>
			<!-- <Icon class="h-6 w-6 hover:fill-[#e44332]" icon="simple-icons:todoist"  /> -->
		</a>
		<h1 class="justify-center text-left text-2xl">Tasks</h1>

		<!-- refresh button -->
		<button class="h-max" on:click={eventStore.loadTodoistEvents}>
			<Icon icon="material-symbols:refresh" color="#e44332" class="h-6 w-6" />
		</button>
	</div>
	<!-- horizontal divider -->
	<!-- <div class="h-0.5 w-full bg-gray-500" /> -->

	<div class="flex w-full flex-col items-center justify-center overflow-hidden py-2">
		{#if $eventStore.length != 0 && $projectStore.length != 0}
			{#each $todayTasks as event}
				<Task
					task={event}
					project={$projectStore.filter((project) => project.id == event.projectId)[0]}
					on:delete={deleteTask}
					on:complete={completeTask}
					on:edit={editTask}
				/>
				<!-- divider -->
				<!-- <div class="h-[1px] w-full bg-gray-500" /> -->
			{/each}
		{/if}
		{#if add}
			<div class="m-4 flex w-full flex-col">
				<input
					id="addInput"
					type="text"
					class="flex-1 appearance-none rounded bg-transparent focus:border-todoist-4 focus:ring-0"
					bind:value={addText}
					on:keypress={(event) => {
						if (event.key === 'Enter') {
							addTask();
						}
					}}
				/>

				<div class="my-1 flex justify-end gap-3">
					<!-- cancel button -->
					<button class="h-max" on:click={toggleAdd}>
						<Icon icon="ic:baseline-close" color="#000000" class="h-6 w-6" />
					</button>
					<!-- save button -->
					<button class="h-max rounded bg-todoist-4" on:click={addTask}>
						<Icon icon="ic:round-send" color="#ffffff" class="m-0.5 h-5 w-5" />
					</button>
				</div>
			</div>
		{:else}
			<!-- add task button -->
			<button class="m-8 h-max" on:click={toggleAdd}>
				<Icon icon="ic:baseline-add" color="#e44332" class="h-6 w-6" />
			</button>
		{/if}
	</div>
</div>
