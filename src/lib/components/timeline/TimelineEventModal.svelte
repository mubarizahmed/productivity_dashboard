<script lang="ts">
	import { calendars } from '$lib/store/stores';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import { closeModal, createModalEventDispatcher } from 'svelte-modals';

	// provided by <Modals />
	export let isOpen;

	export let add: boolean;
	export let name: string;
	export let startDateTime: string;
	export let endDateTime: string;
	export let id: string;

	let addCalendar = 'primary';

	const dispatcher = createModalEventDispatcher<{
		add: { eventId: string };
	}>();

	function addEventForward() {
		dispatcher('add', {
			name: name,
			startDateTime: startDateTime.slice(0, 19) + ':00+01:00',
			endDateTime: endDateTime.slice(0, 19) + ':00+01:00',
			calendarId: $calendars[addCalendar]
		});
		closeModal();
	}
</script>

{#if isOpen}
	<div role="dialog" class="modal">
		<div class="contents">
			{#if add}
				<div
					class="group my-1 flex w-full flex-col items-start justify-start gap-2 rounded bg-white p-2"
				>
					<div class="flex w-full flex-col">
						<input
							id="editInput"
							type="text"
							class="flex-1 appearance-none rounded bg-transparent focus:border-todoist-4 focus:ring-0"
							bind:value={name}
							on:keypress={(event) => {
								if (event.key === 'Enter') {
									addEventForward();
								}
							}}
						/>
						<div class="my-1 flex justify-between gap-3">
							<input
								type="datetime-local"
								step="9000"
								bind:value={startDateTime}
								class="appearance-none rounded bg-transparent text-xs focus:border-todoist-4 focus:ring-0"
							/>
							<input
								type="datetime-local"
								step="9000"
								bind:value={endDateTime}
								class="appearance-none rounded bg-transparent text-xs focus:border-todoist-4 focus:ring-0"
							/>
						</div>

						<div class="my-1 flex justify-between gap-3">
							<!-- calendar picker -->
							<div class="flex justify-between gap-3">
								{#each Object.keys($calendars) as label}
									<button
										class="h-max rounded border p-1 text-xs {label === addCalendar
											? 'border-red-600 text-red-600'
											: 'border-gray-600'}"
										on:click={() => (addCalendar = label)}
									>
										{label}
									</button>
								{/each}
							</div>
							<div class="flex gap-3">
								<!-- cancle button -->
								<button class="h-max" on:click={closeModal}>
									<Icon icon="ic:baseline-close" color="#000000" class="h-6 w-6" />
								</button>
								<!-- save button -->
								<button class="h-max rounded bg-todoist-4" on:click={addEventForward}>
									<Icon icon="ic:round-send" color="#ffffff" class="m-0.5 h-5 w-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{:else}{/if}
		</div>
	</div>
{/if}

<style>
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		/* allow click-through to backdrop */
		pointer-events: none;
	}

	.contents {
		min-width: 240px;
		border-radius: 6px;
		padding: 16px;
		background: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
	}

	h2 {
		text-align: center;
		font-size: 24px;
	}

	p {
		text-align: center;
		margin-top: 16px;
	}

	.actions {
		margin-top: 32px;
		display: flex;
		justify-content: flex-end;
	}
</style>
