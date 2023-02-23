import { PUBLIC_GCAL_CLIENT_ID, PUBLIC_GCAL_API_KEY } from '$env/static/public';
import { supabaseClient } from '$lib/supabaseClient';
import type { EventType, CalendarType } from '$lib/types/types';
import { page } from '$app/stores';

const CLIENT_ID = PUBLIC_GCAL_CLIENT_ID;
const API_KEY = PUBLIC_GCAL_API_KEY;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
	await gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: [DISCOVERY_DOC]
	});
	console.log('gapi loaded');
}

export function gapiLoad() {
	gapi.load('client', initializeGapiClient);
}

export async function listEvents(minDate: Date, maxDate: Date, calendar: string, provider_token: string) {
	let response: EventType[] = [];

	const rs = await fetch(
		'https://www.googleapis.com/calendar/v3/calendars/' +
			calendar +
			'/events?timeMin=' +
			minDate.toISOString() +
			'&timeMax=' +
			maxDate.toISOString(),
		{
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + provider_token
			}
		}
	);

	const res = await rs.json();

	if (rs.status == 200 && res.items?.length > 0) {
		console.log('res-good', res);
		response = res.items.map((cal: CalendarType) => calendarToEvent(cal, calendar));
		console.log('response', response);
	}

	return response;
}

function calendarToEvent(cal: CalendarType, calId: string) {
	return {
		id: 'gcal/' + cal.id,
		name: cal.summary,
		url: cal.htmlLink,
		projectId: 'gcal/' + calId,
		completed: undefined,
		dueDate: undefined,
		priority: undefined,
		startDateTime: cal.start.dateTime,
		endDateTime: cal.end.dateTime,
		isTask: false
	};
}

export async function editCalendarEvent(event: EventType, provider_token: string) {
  const rs = await fetch('https://www.googleapis.com/calendar/v3/calendars/' + event.projectId.slice(5) + '/events/' + event.id.slice(5), {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + provider_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      summary: event.name,
      start: {
        dateTime: event.startDateTime?.slice(0, 19)
      },
      end: {
        dateTime: event.endDateTime?.slice(0, 19)
      }
    })
  });

  const res = await rs.json();

  if (rs.status == 200) {
    console.log('res-good', res);
    return true;
  }
}
