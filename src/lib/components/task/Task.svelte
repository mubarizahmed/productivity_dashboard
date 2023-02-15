<script>
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let taskData = [];
	export let projectName = '';
	export let projectUrl = '';
	export let sectionName = '';

	let edit = false;
	let editText = '';

	const dispatcher = createEventDispatcher();

	$: console.log(projectName, projectUrl, sectionName);

	function toggleEdit() {
		edit = !edit;
		editText = taskData.content;
	}

	function editTaskForward() {
		dispatcher('edit', { taskId: taskData.id, editText: editText });
		taskData.content = editText;
		toggleEdit();
	}
</script>

<div class="group flex w-full border-gray-400 rounded border my-1 flex-row items-center justify-start gap-2 p-2">
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
					on:click={() => dispatcher('delete', { taskId: taskData.id })}
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
			class=" flex h-6 w-6 items-center justify-center rounded-full border-2 border-todoist-{taskData.priority} bg-opacity-50 bg-todoist-{taskData.priority} hover:bg-opacity-100"
			on:click={() => {
				dispatcher('complete', { taskId: taskData.id });
			}}
		>
			<Icon icon="carbon:checkmark" color="#ffffff" class="h-4 w-4" />
		</button>
		<!-- Task content -->
		<div class="flex flex-1 flex-col">
			<div class="flex flex-1 flex-row items-center justify-between">
				<!-- task name -->
				<h1 class="text-l flex-1">{taskData?.content}</h1>
				<!-- edit button -->
				<button class="h-max invisible group-hover:visible" on:click={toggleEdit}>
					<Icon icon="carbon:edit" color="#000000" class="h-4 w-4" />
				</button>
			</div>
			<div class="flex flex-1 flex-row justify-between gap-8">
				<!-- task project -->
				<a class="text-xs" href={projectUrl} target="_blank" rel="noopener noreferrer"
					>{projectName + (sectionName ? '/' + sectionName : '')}</a
				>

				<!-- task due date -->
				<p class="text-xs">{taskData.due.string}</p>
			</div>
		</div>
	{/if}
</div>
