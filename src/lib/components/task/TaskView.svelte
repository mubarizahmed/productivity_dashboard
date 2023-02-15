<script>
	import { TodoistApi } from '@doist/todoist-api-typescript';
	import { PUBLIC_TODOIST_API_TOKEN } from '$env/static/public';
	console.log(PUBLIC_TODOIST_API_TOKEN);
	const api = new TodoistApi(PUBLIC_TODOIST_API_TOKEN);
	import Icon from '@iconify/svelte';
	import Task from '$lib/components/task/Task.svelte';

	let tasksList = [];
	let projectsList = [];
	let sectionsList = [];
	let add = false;
	let addText = '';

	async function getTodoistData() {
		// get projects
		api
			.getProjects()
			.then((projects) => {
				console.log(projects);
				projectsList = projects;
				// get sections
				api
					.getSections()
					.then((sections) => {
						console.log(sections);
						sectionsList = sections;
						// get tasks
						api
							.getTasks({ filter: 'today | overdue' })
							.then((tasks) => {
								tasksList = tasks;
								console.log(tasksList);
							})
							.catch((error) => console.log(error));
					})
					.catch((error) => console.log(error));
			})
			.catch((error) => console.log(error));

		console.log(tasksList, projectsList, sectionsList);
	}

	// get project, label from task
	function getProjectLabelFromTask(task) {
		let projectName, projectUrl, sectionName, sectionUrl;
		projectsList.map((project) => {
			if (project.id === task.projectId) {
				projectName = project.name;
				projectUrl = project.url;
			}
		});
		sectionsList.map((section) => {
			if (section.id === task.sectionId) {
				sectionName = section.name;
			}
		});
		console.log(projectName, projectUrl, sectionName);
		return { projectName, projectUrl, sectionName };
	}

	// edit task function
	function editTask(event) {
		console.log(event.detail.editText);
		api
			.updateTask(event.detail.taskId, { content: event.detail.editText })
			.then((task) => {
				console.log(task);
			})
			.catch((error) => console.log(error));
	}

	// complete task function
	function completeTask(event) {
		console.log('completed');
		api
			.closeTask(event.detail.taskId)
			.then((task) => console.log(task))
			.catch((error) => console.log(error));
	}

	// delete task function
	function deleteTask(event) {
		console.log('deleted');
		api
			.deleteTask(event.detail.taskId)
			.then((task) => console.log(task))
			.catch((error) => console.log(error));
	}

	// toggle add
	function toggleAdd() {
		add = !add;
	}

	// add task function
	function addTask() {
		console.log(addText);
		api
			.addTask({ content: addText })
			.then((task) => console.log(task))
			.catch((error) => console.log(error));
	}
</script>

<div class="flex w-full h-full flex-col items-start gap-2 rounded-xl bg-gray-300 p-3">
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
				class="h-6 w-6 hover:fill-[#e44332]"
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
		<button class="h-max" on:click={getTodoistData}>
			<Icon icon="material-symbols:refresh" color="#e44332" class="h-6 w-6" />
		</button>
	</div>
	<!-- horizontal divider -->
	<div class="h-0.5 w-full bg-gray-500" />

	<div class="flex flex-col w-full items-center justify-center overflow-hidden">
		{#await getTodoistData()}
			<div>loading...</div>
		{:then}
			{#each tasksList as task}
				<Task
					taskData={task}
					{...getProjectLabelFromTask(task)}
					on:edit={editTask}
					on:complete={completeTask}
					on:delete={deleteTask}
				/>
				<!-- divider -->
				<!-- <div class="h-[1px] w-full bg-gray-500" /> -->
			{/each}

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
		{/await}
	</div>
</div>
