<script lang="ts">
	/* exported gapiLoaded */
	/* exported gisLoaded */
	/* exported handleAuthClick */
	/* exported handleSignoutClick */
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import CalendarEvent from './CalendarEvent.svelte';
	import { eventStore } from '$lib/store/eventStore';
	import { projectStore } from '$lib/store/projectStore';
	import { page } from '$app/stores';

	let calendars = {
		primary: 'primary',
		classes: '8tciba5ockfvb8rklc4hppqqao@group.calendar.google.com',
		planner:
			'4ae44282c14f6b5f93b3881395d3be21ef30c90e45a5c5d1512d456d403563bc@group.calendar.google.com'
	};

	let add = false;
	let addSummary = '';
	let addStart = '';
	let addEnd = '';
	let addCalendar = 'primary';


	import { supabaseClient } from '$lib/supabaseClient';
	import Auth from '../auth/Auth.svelte';
	import type { EventType } from '$lib/types/types';

	function deleteEvent(event) {
		// eventStore.deleteEvent(event);
	}

	function editEvent(event: CustomEvent<{ event: EventType }>) {
		console.log('edit event: ', event.detail.event);
		eventStore.editCalendarEvent(event.detail.event);
	}

	function toggleAdd() {
		add = !add;
	}
	async function addEvent() {
	
	}
	


</script>

<!--Add buttons to initiate auth sequence and sign out-->
<button id="list_events" on:click={eventStore.loadCalendarEvents}>List Events</button>

{#each $eventStore.filter((event) => !event.isTask) as event}
	<CalendarEvent {event} on:delete={deleteEvent} on:edit={editEvent} />
{/each}

{#if add}
	<div class="group my-1 flex w-full flex-col items-start justify-start gap-2 rounded bg-white p-2">
		<div class="flex w-full flex-col">
			<input
				id="editInput"
				type="text"
				class="flex-1 appearance-none rounded bg-transparent focus:border-todoist-4 focus:ring-0"
				bind:value={addSummary}
				on:keypress={(event) => {
					if (event.key === 'Enter') {
						addEvent();
					}
				}}
			/>
			<div class="my-1 flex justify-between gap-3">
				<input
					type="datetime"
					step="9000"
					bind:value={addStart}
					class="appearance-none rounded bg-transparent text-xs focus:border-todoist-4 focus:ring-0"
				/>
				<input
					type="datetime"
					step="9000"
					bind:value={addEnd}
					class="appearance-none rounded bg-transparent text-xs focus:border-todoist-4 focus:ring-0"
				/>
			</div>

			<div class="my-1 flex justify-between gap-3">
				<!-- calendar picker -->
				<div class="flex justify-between gap-3">
					{#each Object.keys(calendars) as label}
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
					<button class="h-max" on:click={toggleAdd}>
						<Icon icon="ic:baseline-close" color="#000000" class="h-6 w-6" />
					</button>
					<!-- save button -->
					<button class="h-max rounded bg-todoist-4" on:click={addEvent}>
						<Icon icon="ic:round-send" color="#ffffff" class="m-0.5 h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<button class="h-max" on:click={toggleAdd}>
		<Icon icon="ic:baseline-add" color="#000000" class="h-6 w-6" />
	</button>
{/if}
