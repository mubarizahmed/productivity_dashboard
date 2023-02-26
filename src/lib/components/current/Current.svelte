<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import { currentTimer } from '$lib/store/stores';
	import { eventStore } from '$lib/store/eventStore';
	import { projectStore } from '$lib/store/projectStore';
	import { timerStore } from '$lib/store/timerStore';
  import currentImage from '$lib/assets/public/currentImage.png';
	import type { EventType, ProjectType, TimerType } from '$lib/types/types';

	let event: EventType;
	let project: ProjectType;
	let projectName: string;
	let time = new Date();
	let duration: Date;
	let paused = false;

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	onDestroy(() => {
		console.log('destroyed');
		stop();
	});

	function pause() {
		paused = true;
		if ($currentTimer) {
			$currentTimer.pausedAt = new Date().toISOString();
		}
	}

	function resume() {
		paused = false;
		if ($currentTimer && $currentTimer.pausedAt) {
			$currentTimer.pausedDuration = time.valueOf() - new Date($currentTimer.pausedAt).valueOf();
			$currentTimer.pausedAt = undefined;
		}
	}

	function stop() {
		if ($currentTimer) {
			if (paused && $currentTimer.pausedAt) {
				$currentTimer.pausedDuration = time.valueOf() - new Date($currentTimer.pausedAt).valueOf();
			}
			timerStore.stopTimer($currentTimer);
		}
	}

	$: console.log($currentTimer);

	$: if ($currentTimer) {
		event = $eventStore.find((event) => event.id === $currentTimer.eventId);
		if (event) {
			project = $projectStore.find((project) => project.id === event.projectId);
			if (project) {
				// get project name
				const projectNameArray = project.name.split('/');
				projectName = projectNameArray[projectNameArray.length - 1];
			}
		}
	}
	$: if ($currentTimer) {
		duration = new Date(time.valueOf() - new Date($currentTimer.startedAt).valueOf() - 3600000);
	}
</script>

{#if $currentTimer && event && project}
	<div
		class="flex h-full flex-[1] items-center justify-between gap-8 rounded-xl border-2 border-space-cadet bg-blue-violet p-4"
	>
		<div class="flex-col items-center gap-4 text-white">
			<h1 class="text-cool-gray-100 mb-2 text-4xl text-white">{event.name}</h1>
			<div
				class="h-fit w-fit rounded bg-space-cadet p-1 text-center text-[10px] font-semibold uppercase text-cool-gray"
			>
				{projectName}
			</div>
		</div>
		<div
			class="min-w-20 flex flex-col items-center justify-around gap-1 rounded-xl bg-space-cadet p-2"
		>
			<p class="text-2xl text-todoist-4">{duration.toTimeString().slice(0, 5)}</p>
			<div class="flex w-fit items-center justify-around gap-1">
				{#if paused}
					<!-- stop button -->
					<button class="flex h-8 w-8" on:click={stop}>
						<svg
							class="fill-todoist-4"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							><path
								d="M8 18q-.825 0-1.413-.588T6 16V8q0-.825.588-1.413T8 6h8q.825 0 1.413.588T18 8v8q0 .825-.588 1.413T16 18H8Z"
							/></svg
						>
					</button>
					<!-- resume button -->
					<button class="flex h-8 w-8" on:click={resume}>
						<svg
							class="fill-todoist-4"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"><path d="M6 18V6h2v12H6Zm4 0l10-6l-10-6v12Z" /></svg
						>
					</button>
				{:else}
					<!-- pause button -->
					<button class="flex h-8 w-8" on:click={pause}>
						<svg
							class="fill-todoist-4"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"><path d="M14 19V5h4v14h-4Zm-8 0V5h4v14H6Z" /></svg
						>
					</button>
				{/if}
				<!-- complete button -->
				<button class="flex h-8 w-8">
					<svg
						class="fill-mint"
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						><path
							d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z"
						/></svg
					>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div
		class="flex h-full flex-[1] items-center justify-between gap-8 rounded-xl border-2 border-space-cadet bg-rich-black-2 p-4"
	>
		<h1 class="text-cool-gray-100 mb-2 text-4xl text-cool-gray">Carpe Diem!</h1>
    <img class="h-full" src={currentImage} alt="getting work done" />
	</div>
{/if}
