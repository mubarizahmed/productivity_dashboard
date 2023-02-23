<script lang="ts">
	import type { EventType } from '$lib/types/types';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let event: EventType;

	let edit = false;
	let editSummary = '';
	let editStart = '';
	let editEnd = '';

	const dispatcher = createEventDispatcher<{
		edit: { event: EventType };
		delete: { eventId: string };
	}>();

	function toggleEdit() {
		edit = !edit;
		editSummary = event.name;
    editStart = event.startDateTime?.slice(0,19);
    editEnd = event.endDateTime?.slice(0,19);

	}

	function editEventForward() {
		event.name = editSummary;
		event.startDateTime = editStart.slice(0,16)+":00+01:00";
		event.endDateTime = editEnd.slice(0,16)+":00+01:00";

		dispatcher('edit', { event: event});
		toggleEdit();
	}

	function deleteEventForward() {
		dispatcher('delete', { eventId: event.id});
		toggleEdit();
	}
</script>

<div class="group my-1 flex w-full flex-col items-start justify-start gap-2 rounded bg-white p-2">
	{#if edit}
		<div class="flex w-full flex-col">
			<input
				id="editInput"
				type="text"
				class="flex-1 appearance-none rounded bg-transparent focus:border-todoist-4 focus:ring-0"
				bind:value={editSummary}
				on:keypress={(event) => {
					if (event.key === 'Enter') {
						editEventForward();
					}
				}}
			/>
      <div class="my-1 flex justify-between gap-3">
        <input type="datetime-local" step="9000" bind:value={editStart} class="appearance-none rounded bg-transparent focus:border-todoist-4 focus:ring-0 text-xs"/>
        <input type="datetime-local" step="9000" bind:value={editEnd} class="appearance-none rounded bg-transparent focus:border-todoist-4 focus:ring-0 text-xs"/>
      </div>

			<div class="my-1 flex justify-between gap-3">
				<!-- delete button -->
				<button
					class="h-max rounded hover:bg-todoist-4"
					on:click={deleteEventForward}
				>
					<Icon icon="ic:baseline-delete-forever" color="#000000" class="h-6 w-6" />
				</button>
				<div class="flex gap-3">
					<!-- cancle button -->
					<button class="h-max" on:click={toggleEdit}>
						<Icon icon="ic:baseline-close" color="#000000" class="h-6 w-6" />
					</button>
					<!-- save button -->
					<button class="h-max rounded bg-todoist-4" on:click={editEventForward}>
						<Icon icon="ic:round-send" color="#ffffff" class="m-0.5 h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex w-full flex-row items-between justify-between p-2">
			<div class="group flex w-full flex-col items-start justify-start gap-1">
				<h2 class="text-l font-bold">{event.name}</h2>
				<p class="text-m ">
					{event.startDateTime.slice(11, 16) + ' - ' + event.endDateTime.slice(11, 16)}
				</p>
			</div>
      <div class="flex flex-col items-center justify-center">
				<button class="h-max invisible group-hover:visible" on:click={toggleEdit}>
					<Icon icon="carbon:edit" color="#000000" class="h-8 w-8" />
				</button>
      </div>
		</div>
	{/if}
</div>
