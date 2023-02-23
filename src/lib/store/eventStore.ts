import type { EventWithProject, EventType } from '$lib/types/types';
import type { ProjectType } from '$lib/types/project.type';
import { supabaseClient, db } from '$lib/supabaseClient';
import { calendars, user } from '$lib/store/stores';
import { writable } from 'svelte/store';
import type { definitions } from '$lib/types/generated-types';
import {
	getTodoistData,
	completeTodoistTask,
	reopenTodoistTask,
	editTodoistTask,
	deleteTodoistTask,
	addTodoistTask
} from '$lib/functions/Todoist';
import { editCalendarEvent, listEvents } from '$lib/functions/GCal';
import { page } from '$app/stores';

function createEvents(initial: EventType[]) {
	const { subscribe, set, update } = writable<Array<EventType>>(initial);
	const upvertEvent = (event: EventType) => {
		update((events) => {
			console.log('upvertEvent', events);
			if (events) {
				if (events.find((i) => i.id === event.id)) {
					return events.map((i) => {
						if (i.id === event.id) {
							return event;
						}
						return i;
					});
				} else {
					return [...events, event];
				}
			}
			return [events, event];
		});
	};

	const addEvent = async (event: EventType) => {
		user.subscribe(async (u) => {
			event.user_id = u.id;
			const { data, error } = await db.events().upsert(event).select();
			if (error) {
				console.log('error', error);
			} else {
				upvertEvent(data[0]);
			}
		});
	};

	const deleteEvent = async (eventId: string) => {
		user.subscribe(async (user) => {
			const { data, error } = await supabaseClient
				.from('events')
				.delete()
				.eq('id', eventId)
				.eq('user_id', user.id)
				.select();
			if (error) {
				console.log('error', error);
			} else {
				console.log('data', data);
				update((events) => {
					if (events) {
						return events.filter((i) => i.id !== eventId);
					}
					return [];
				});
			}
		});
	};
	return {
		subscribe,
		loadEvents: async () => {
			const { data, error } = await db.events().select();
			if (error) {
				console.log('error', error);
			} else {
				set(data);
			}
		},
		addEvent,
		deleteEvent,

		clear: () => set([]),

		// Todoist specific methods
		loadTodoistEvents: async () => {
			var events = await getTodoistData();

			events.forEach((event) => {
				addEvent(event);
			});
		},
		editTask: async (event: EventType) => {
			editTodoistTask(event);
			addEvent(event);
		},
		completeTask: async (eventId: string, completed: boolean) => {
			if (completed) {
				if (!completeTodoistTask(eventId)) return;
			} else {
				if (!reopenTodoistTask(eventId)) return;
			}

			user.subscribe(async (user) => {
				const { data, error } = await db
					.events()
					.upsert({
						id: eventId,
						completed: completed,
						user_id: user.id
					})
					.select();
				if (error) {
					console.log('error', error);
				} else {
					upvertEvent(data[0]);
				}
			});
		},
		deleteTask: async (eventId: string) => {
			deleteTodoistTask(eventId);
			deleteEvent(eventId);
		},
		addTask: async (event: EventType) => {
			var res = await addTodoistTask(event);

			if (res) {
				addEvent(res);
			}
		},

		// Calendar specific methods
		loadCalendarEvents: async () => {
			let todayDate = new Date();
			todayDate.setHours(0, 0, 0, 0);
			console.log(todayDate);
			// get tommorow's date
			let weekDate = new Date(todayDate);
			weekDate.setDate(weekDate.getDate() + 7);

			page.subscribe(async (p) => {
				if (p.data?.session?.provider_token) {
					calendars.subscribe(async (calendars) => {
						for (var label in calendars) {
							var events = await listEvents(
								todayDate,
								weekDate,
								calendars[label],
								p.data.session.provider_token
							);
							console.log('cal events add', events);
							events.forEach((event) => {
								addEvent(event);
							});
						}
					});
				}
			});
		},
		editCalendarEvent: async (event: EventType) => {
			page.subscribe(async (p) => {
				if (p.data?.session?.provider_token) {
					editCalendarEvent(event, p.data.session.provider_token).then((res) => {
						if (res) addEvent(event);
					});
				}
			});
		}
	};
}

export const eventStore = createEvents([]);
