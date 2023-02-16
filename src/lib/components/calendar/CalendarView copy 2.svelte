<script>
	import { PUBLIC_GCAL_CLIENT_ID, PUBLIC_GCAL_API_KEY } from '$env/static/public';
  import {gapi} from 'gapi-script';
	// TODO(developer): Set to client ID and API key from the Developer Console
	const CLIENT_ID = PUBLIC_GCAL_CLIENT_ID;
	const API_KEY = PUBLIC_GCAL_API_KEY;

	// Discovery doc URL for APIs used by the quickstart
	const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

	// Authorization scopes required by the API; multiple scopes can be
	// included, separated by spaces.
	const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

	function start() {
		// 2. Initialize the JavaScript client library.
		gapi.client
			.init({
				apiKey: API_KEY,
				// Your API key will be automatically added to the Discovery Document URLs.
				discoveryDocs: DISCOVERY_DOC,
				// clientId and scope are optional if auth is not required.
				clientId: CLIENT_ID,
				scope: SCOPES
			})
			.then(function () {
				// 3. Initialize and make the API request.
				return gapi.client.people.people.get({
					resourceName: 'people/me',
					'requestMask.includeField': 'person.names'
				});
			})
			.then(
				function (response) {
					console.log(response.result);
				},
				function (reason) {
					console.log('Error: ' + reason.result.error.message);
				}
			);
	}
	function gapiLoaded() {
		// 1. Load the JavaScript client library.
		gapi.load('client', start);
    console.log("gapi loaded");
	}
  async function listUpcomingEvents() {
    console.log("listUpcomingEvents");
        let response;
        try {
          const request = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
          };
          response = await gapi.client.calendar.events.list(request);
          console.log(response);
          return;
        } catch (err) {
          
          return;
        }
  }
gapiLoaded();
</script>


<button type="button" on:click={listUpcomingEvents}>listEvents</button>
