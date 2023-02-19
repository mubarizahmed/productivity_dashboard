<script lang="ts">
	/* exported gapiLoaded */
	/* exported gisLoaded */
	/* exported handleAuthClick */
	/* exported handleSignoutClick */
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import CalendarEvent from './CalendarEvent.svelte';

	let calendars = {
		primary: 'primary',
		classes: '8tciba5ockfvb8rklc4hppqqao@group.calendar.google.com',
		planner:
			'4ae44282c14f6b5f93b3881395d3be21ef30c90e45a5c5d1512d456d403563bc@group.calendar.google.com'
	};
	export let loadedEvents;
	export let todayEvents;
export let todayDate;
export let tomorrowDate;

	$:{ todayEvents = loadedEvents.filter((event) => {
		let start = new Date(event.start.dateTime);
		return start >= todayDate && start <= tomorrowDate;
	});
	console.log(todayEvents);
}

	let add = false;
	let addSummary = '';
	let addStart = '';
	let addEnd = '';
	let addCalendar = 'primary';

	import { PUBLIC_GCAL_CLIENT_ID, PUBLIC_GCAL_API_KEY } from '$env/static/public';

	// TODO(developer): Set to client ID and API key from the Developer Console
	const CLIENT_ID = PUBLIC_GCAL_CLIENT_ID;
	console.log('Client ID: ' + CLIENT_ID);
	const API_KEY = PUBLIC_GCAL_API_KEY;

	// Discovery doc URL for APIs used by the quickstart
	const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

	// Authorization scopes required by the API; multiple scopes can be
	// included, separated by spaces.
	const SCOPES =
		'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';

	let tokenClient;
	let gapiInited = false;
	let gisInited = false;

	onMount(async () => {
		// Load the API client and auth2 library
		const script = document.createElement('script');
		script.src = 'https://apis.google.com/js/api.js';
		script.onload = gapiLoaded;
		document.body.appendChild(script);

		// Load the Google Identity Services library
		const script2 = document.createElement('script');
		script2.src = 'https://accounts.google.com/gsi/client';
		script2.onload = gisLoaded;
		document.body.appendChild(script2);

		gapiLoaded();
		gisLoaded();
	});
	/**
	 * Callback after api.js is loaded.
	 */
	function gapiLoaded() {
		gapi.load('client', initializeGapiClient);
	}

	/**
	 * Callback after the API client is loaded. Loads the
	 * discovery doc to initialize the API.
	 */
	async function initializeGapiClient() {
		await gapi.client.init({
			apiKey: API_KEY,
			discoveryDocs: [DISCOVERY_DOC]
		});
		gapiInited = true;
		console.log('gapi loaded');
	}

	/**
	 * Callback after Google Identity Services are loaded.
	 */
	function gisLoaded() {
		tokenClient = google.accounts.oauth2.initTokenClient({
			client_id: CLIENT_ID,
			scope: SCOPES,
			callback: '' // defined later
		});
		gisInited = true;
		console.log('gis loaded');
	}

	/**
	 *  Sign in the user upon button click.
	 */
	function handleAuthClick() {
		tokenClient.callback = async (resp) => {
			if (resp.error !== undefined) {
				throw resp;
			}
		};

		if (gapi.client.getToken() === null) {
			// Prompt the user to select a Google Account and ask for consent to share their data
			// when establishing a new session.
			tokenClient.requestAccessToken({ prompt: 'consent' });
		} else {
			// Skip display of account chooser and consent dialog for an existing session.
			tokenClient.requestAccessToken({ prompt: '' });
		}
	}

	/**
	 *  Sign out the user upon button click.
	 */
	function handleSignoutClick() {
		const token = gapi.client.getToken();
		if (token !== null) {
			google.accounts.oauth2.revoke(token.access_token);
			gapi.client.setToken('');
		}
	}

	/**
	 * Print the summary and start datetime/date of the next ten events in
	 * the authorized user's calendar. If no events are found an
	 * appropriate message is printed.
	 */
	async function listEvents(
		minDate: Date,
		maxDate: Date,
		calendarLabel: string
	): Promise<Object[]> {
		let response;
		try {
			const request = {
				calendarId: calendars[calendarLabel],
				timeMin: minDate.toISOString(),
				timeMax: maxDate.toISOString(),
				showDeleted: false,
				singleEvents: true,
				orderBy: 'startTime'
			};
			response = await gapi.client.calendar.events.list(request);
			console.log(response);
			response.result.items.forEach((res) => {
				console.log(res.id);
				if (
					!loadedEvents.find((event) => {
						return event.id == res.id;
					})
				) {
					res.calendarLabel = calendarLabel;
					res.calendarId = calendars[calendarLabel];
					loadedEvents.push(res);
					loadedEvents.sort(sortEvents);
					loadedEvents = loadedEvents;
				}
			});
			console.log(loadedEvents);
			return [];
		} catch (err) {
			console.log(err.message);
			return [];
		}
	}

	function sortEvents(a, b) {
		if (a.start.dateTime < b.start.dateTime) {
			return -1;
		}
		if (a.start.dateTime > b.start.dateTime) {
			return 1;
		}
		return 0;
	}

	async function listTodayEvents() {
		// add events to list without duplicates
		var todayDate = new Date();
		todayDate.setHours(0, 0, 0, 0);
		console.log(todayDate);
		// get tommorow's date
		var tomorrowDate = new Date(todayDate);
		tomorrowDate.setDate(tomorrowDate.getDate() + 1);

		console.log(tomorrowDate);
		for (var label in calendars) {
			listEvents(todayDate, tomorrowDate, label);
		}
	}

	async function editEvent(event) {
		console.log('edit: ' + event.detail.editSummary);
		let response;
		console.log(event.detail.event.end.dateTime);
		console.log(event.detail.editEnd);
		console.log('2023-02-17T21:32:00+01:00');
		try {
			const request = {
				calendarId: event.detail.calendarId,
				eventId: event.detail.eventId,

				resource: {
					summary: event.detail.editSummary,
					end: {
						dateTime: event.detail.event.end.dateTime
					},
					start: {
						dateTime: event.detail.event.start.dateTime
					}
				}
			};
			response = await gapi.client.calendar.events.patch(request);
			// update event in events
			updateEvent(response.result);
			loadedEvents = loadedEvents;
			console.log(response);
		} catch (err) {
			console.log(err.message);
		}
	}
	function updateEvent(event){
		console.log('eventUpdate');

		loadedEvents = loadedEvents.map((i) => {
			if (i.id == event.Id) {
				i = {...i, ...event}
			}
			return i;
		});
	}

	async function deleteEvent(event) {
		console.log('delete: ' + event.detail.eventId);
		let response;
		try {
			const request = {
				calendarId: event.detail.calendarId,
				eventId: event.detail.eventId
			};
			response = await gapi.client.calendar.events.delete(request);
			loadedEvents = loadedEvents.filter((i) => {
				return i.id !== event.detail.eventId;
			});
			// loadedEvents = loadedEvents;
		} catch (err) {
			console.log(err.message);
		}
	}

	function toggleAdd() {
		add = !add;
	}
	async function addEvent() {
		console.log('add' + addSummary + ' ' + addStart + ' ' + addEnd);
		let response;
		try {
			const request = {
				calendarId: calendars[addCalendar],
				resource: {
					summary: addSummary,
					end: {
						dateTime: addEnd.slice(0, 16) + ':00+01:00'
					},
					start: {
						dateTime: addStart.slice(0, 16) + ':00+01:00'
					}
				}
			};
			response = await gapi.client.calendar.events.insert(request);
			console.log(response);
			if (response.status == 200) {
				loadedEvents.push(response.result);
				loadedEvents.sort(sortEvents);
				loadedEvents = loadedEvents;
				toggleAdd();
			}
		} catch (err) {
			console.log(err.message);
		}
	}

	$: console.log(loadedEvents);
</script>

<!--Add buttons to initiate auth sequence and sign out-->
<button id="authorize_button" on:click={handleAuthClick}>Authorize</button>
<button id="signout_button" on:click={handleSignoutClick}>Sign Out</button>
<button id="list_events" on:click={listTodayEvents}>List Events</button>

{#each todayEvents as event}
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
					type="datetime-local"
					step="9000"
					bind:value={addStart}
					class="appearance-none rounded bg-transparent text-xs focus:border-todoist-4 focus:ring-0"
				/>
				<input
					type="datetime-local"
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
