<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	import '@fullcalendar/core/vdom';

	import { Draggable } from 'svelte-fullcalendar';
	import { timerStore } from '$lib/store/timerStore';
	import type { EventType, ProjectType } from '$lib/types/types';

	export let task: EventType;
	export let project: ProjectType;
	console.log('taskProject', project);

	// get project name
	var projectNameArray = project.name.split('/');
	let projectName: string;
	$: projectName = projectNameArray[projectNameArray.length - 1];

	// get due date
	let dueDate: string;
	$: if (task.dueDate) {
		dueDate = new Date(task.dueDate).toDateString().slice(4, 10);
	}

	let edit = false;
	let editText = '';

	const dispatcher = createEventDispatcher<{
		edit: { event: EventType };
		delete: { eventId: string };
		complete: { event: EventType };
	}>();

	function toggleEdit() {
		edit = !edit;
		editText = task.name;
	}

	function editTaskForward() {
		console.log(task.id);
		task.name = editText;
		dispatcher('edit', { event: task });
		toggleEdit();
	}

	function deleteTaskForward() {
		dispatcher('delete', { eventId: task.id });
		toggleEdit();
	}

	function completeTaskForward() {
		dispatcher('complete', { event: task });
	}

	function startTimer() {
		console.log('start timer');
		timerStore.startTimer(task.id, new Date());
	}
</script>

<Draggable
	class="h-full w-full"
	eventData={{ title: task.name, duration: '00:30', id: task.id, backgroundColor: '#29B67Eff', classNames: ['todo-event'] }}
>
	<div
		class="group my-1 flex w-full flex-row items-center justify-start gap-2 rounded border border-space-cadet p-2"
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
					<button class="h-max rounded hover:bg-todoist-4" on:click={deleteTaskForward}>
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
			{#if !task.completed}
				<button
					class=" flex h-6 w-6 items-center justify-center rounded-full border-2 border-todoist-{task.priority} bg-opacity-50 bg-todoist-{task.priority} hover:bg-opacity-100"
					on:click={completeTaskForward}
				>
					<Icon icon="carbon:checkmark" color="#ffffff" class="h-4 w-4" />
				</button>
			{:else}
				<button
					class=" flex h-6 w-6 items-center justify-center rounded-full border-2 border-todoist-{task.priority} bg-todoist-{task.priority} hover:bg-opacity-50"
					on:click={completeTaskForward}
				/>
			{/if}
			<!-- Task content -->
			<div class="flex flex-1 flex-col">
				<div class="flex flex-1 flex-row items-center justify-between">
					<!-- task name -->
					<h1 class="flex-1 text-sm {task.completed ? 'line-through' : ''}">{task.name}</h1>
					<!-- start button -->
					<button class="invisible mr-2 h-max text-xs group-hover:visible" on:click={startTimer}>
						<Icon icon="carbon:play" color="201E3Cff" class="h-4 w-4" />
					</button>
					<!-- edit button -->
					<button class="invisible h-max text-xs group-hover:visible" on:click={toggleEdit}>
						<Icon icon="carbon:edit" color="201E3Cff" class="h-4 w-4" />
					</button>
				</div>
				<div class="flex flex-1 flex-row justify-between gap-8">
					<!-- task project -->
					<a class="text-xs" href={project.todoistURL} target="_blank" rel="noopener noreferrer"
						>{projectName}</a
					>

					<!-- task due date -->
					<p class="text-xs">{dueDate}</p>
				</div>
			</div>
		{/if}
	</div>
</Draggable>
