<script>
	import fs from 'fs';
	import path from 'path';
	import { google } from 'googleapis';
	import authenticate from '@google-cloud/local-auth';

	// If modifying these scopes, delete token.json.
	const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first
	// time.
	const TOKEN_PATH = path.join('token.json');
	const CREDENTIALS_PATH = path.join('credentials.json');
	const credentials = {
		web: {
			client_id: '134944352773-is6uc47mcpe8qcfse1d9hks2smfj3meg.apps.googleusercontent.com',
			project_id: 'dashboard-377918',
			auth_uri: 'https://accounts.google.com/o/oauth2/auth',
			token_uri: 'https://oauth2.googleapis.com/token',
			auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
			client_secret: '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',
			javascript_origins: ['https://localhost:5173']
		}
	};

	/**
	 * Reads previously authorized credentials from the save file.
	 *
	 * @return {Promise<OAuth2Client|null>}
	 */
	async function loadSavedCredentialsIfExist() {
		try {
			const content = await fs.readFile(TOKEN_PATH);
			const credentials = JSON.parse(content);
			return google.auth.fromJSON(credentials);
		} catch (err) {
			return null;
		}
	}

	/**
	 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
	 *
	 * @param {OAuth2Client} client
	 * @return {Promise<void>}
	 */
	async function saveCredentials(client) {
		const key = credentials.installed || credentials.web;
		const payload = JSON.stringify({
			type: 'authorized_user',
			client_id: key.client_id,
			client_secret: key.client_secret,
			refresh_token: client.credentials.refresh_token
		});
		await fs.writeFile(TOKEN_PATH, payload);
	}

	/**
	 * Load or request or authorization to call APIs.
	 *
	 */
	async function authorize() {
		let client = await loadSavedCredentialsIfExist();
		if (client) {
			return client;
		}
		await fs.writeFile(CREDENTIALS_PATH, JSON.stringify(credentials));
		client = await authenticate({
			scopes: SCOPES,
			keyfilePath: CREDENTIALS_PATH
		});
		if (client.credentials) {
			await saveCredentials(client);
		}
		return client;
	}

	/**
	 * Lists the next 10 events on the user's primary calendar.
	 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
	 */
	async function listEvents(auth) {
		const calendar = google.calendar({ version: 'v3', auth });
		const res = await calendar.events.list({
			calendarId: 'primary',
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime'
		});
		const events = res.data.items;
		if (!events || events.length === 0) {
			console.log('No upcoming events found.');
			return;
		}
		console.log('Upcoming 10 events:');
		events.map((event, i) => {
			const start = event.start.dateTime || event.start.date;
			console.log(`${start} - ${event.summary}`);
		});
	}

	async function listUpcomingEvents() {
		authorize().then(listEvents).catch(console.error);
	}
</script>

<button type="button" on:click={listUpcomingEvents}>listEvents</button>
