<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import type { EventType } from '$lib/types/event.type';

	export let task: EventType;

	let edit = false;
	let editText = '';

	const dispatcher = createEventDispatcher<{
		edit: { eventId: string; editText: string };
		delete: { eventId: string };
		complete: { eventId: string };
	}>();

	function toggleEdit() {
		edit = !edit;
		editText = task.name;
	}

	function editTaskForward() {
		console.log(task.id);
		dispatcher('edit', { eventId: task.id, editText: editText });
		toggleEdit();
	}

	function deleteTaskForward() {
		dispatcher('delete', { eventId: task.id });
	}

	function completeTaskForward() {
		dispatcher('complete', { eventId: task.id });
	}

</script>

<div
	class="group my-1 flex w-full flex-row items-center justify-start gap-2 rounded border border-gray-400 p-2"
>
	{#if edit}
		<div class="flex w-full flex-col">
			<input
				id="editInput"
				type="text"
				class="flex-1 appearance-none rounded bg-transparent focus:border-todoist-4 focus:ring-0"
				bind:value={editText}
				on:keypress={(event) => {
					if (event.key === 'Enter') {
						editTaskForward();
					}
				}}
			/>

			<div class="my-1 flex justify-between gap-3">
				<!-- delete button -->
				<button
					class="h-max rounded hover:bg-todoist-4"
					on:click={deleteTaskForward}
				>
					<Icon icon="ic:baseline-delete-forever" color="#000000" class="h-6 w-6" />
				</button>
				<div class="flex gap-3">
					<!-- cancle button -->
					<button class="h-max" on:click={toggleEdit}>
						<Icon icon="ic:baseline-close" color="#000000" class="h-6 w-6" />
					</button>
					<!-- save button -->
					<button class="h-max rounded bg-todoist-4" on:click={editTaskForward}>
						<Icon icon="ic:round-send" color="#ffffff" class="m-0.5 h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	{:else}
		<!-- circular button color coded based on priority, click to complete task -->
		<button
			class=" flex h-6 w-6 items-center justify-center rounded-full border-2 border-todoist-{task.priority} bg-opacity-50 bg-todoist-{task.priority} hover:bg-opacity-100"
			on:click={completeTaskForward}
		>
			<Icon icon="carbon:checkmark" color="#ffffff" class="h-4 w-4" />
		</button>
		<!-- Task content -->
		<div class="flex flex-1 flex-col">
			<div class="flex flex-1 flex-row items-center justify-between">
				<!-- task name -->
				<h1 class="text-l flex-1">{task.name}</h1>
				<!-- edit button -->
				<button class="invisible h-max text-xs group-hover:visible" on:click={toggleEdit}>
					<Icon icon="carbon:edit" color="#000000" class="h-4 w-4" />
				</button>
			</div>
			<div class="flex flex-1 flex-row justify-between gap-8">
				<!-- task project -->
				<a class="text-xs" href={task.project.todoistURL} target="_blank" rel="noopener noreferrer"
					>{task.project.name}</a
				>

				<!-- task due date -->
				<p class="text-xs">{task.dueDate?.toDateString().slice(4, 10)}</p>
			</div>
		</div>
	{/if}
</div>
