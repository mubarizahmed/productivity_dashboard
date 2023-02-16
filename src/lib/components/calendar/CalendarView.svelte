<script type="text/javascript">
	/* exported gapiLoaded */
	/* exported gisLoaded */
	/* exported handleAuthClick */
	/* exported handleSignoutClick */
	import { PUBLIC_GCAL_CLIENT_ID, PUBLIC_GCAL_API_KEY } from '$env/static/public';

	// TODO(developer): Set to client ID and API key from the Developer Console
	const CLIENT_ID = PUBLIC_GCAL_CLIENT_ID;
	console.log("Client ID: " + CLIENT_ID);
	const API_KEY = PUBLIC_GCAL_API_KEY;

	// Discovery doc URL for APIs used by the quickstart
	const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

	// Authorization scopes required by the API; multiple scopes can be
	// included, separated by spaces.
	const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

	let tokenClient;
	let gapiInited = false;
	let gisInited = false;

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
          callback: '', // defined later
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
            throw (resp);
          }
          await listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
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
	async function listUpcomingEvents() {
		let response;
		try {
			const request = {
				calendarId: 'primary',
				timeMin: new Date().toISOString(),
				showDeleted: false,
				singleEvents: true,
				maxResults: 10,
				orderBy: 'startTime'
			};
			response = await gapi.client.calendar.events.list(request);
			console.log(response);
		} catch (err) {
			console.log(err.message);
			return;
		}

		const events = response.result.items;
		if (!events || events.length == 0) {
			console.log('No upcoming events found.');
			return;
		}
		// Flatten to string to display
		const output = events.reduce(
			(str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
			'Events:\n'
		);
		console.log(output);
	}
</script>

<!--Add buttons to initiate auth sequence and sign out-->
<button id="authorize_button"  on:click={handleAuthClick}>Authorize</button>
<button id="signout_button" on:click={handleSignoutClick}>Sign Out</button>
<button id="list_events" on:click={listUpcomingEvents}>List Events</button>

<pre id="content" style="white-space: pre-wrap;" />
<svelte:head>
	<script async defer src="https://apis.google.com/js/api.js" on:load={gapiLoaded}></script>
	<script async defer src="https://accounts.google.com/gsi/client" on:load={gisLoaded}></script>
</svelte:head>
