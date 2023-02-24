import type { EventWithProject, EventType } from '$lib/types/types';
import type { ProjectType } from '$lib/types/project.type';
import { supabaseClient, db } from '$lib/supabaseClient';
import { calendars, user } from '$lib/store/stores';
import { writable, derived } from 'svelte/store';
import type { definitions } from '$lib/types/generated-types';
import orderBy from 'lodash/orderBy';

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

	// const sortEvents = (events: Array<EventType>) => {
	// 	return events.sort((a, b) => {
	// 		if (a.isTask && b.isTask && a.priority && b.priority) {
	// 			if (a.dueDate == b.dueDate) {
	// 				return a.priority - b.priority;
	// 			}
	// 			if (!a.dueDate) {
	// 				if (!b.dueDate) {
	// 					return 0;
	// 				}
	// 				return 1;

	// 			}
	// 			return a.dueDate? - b.dueDate;
	// 		} else if (!a.isTask && !b.isTask && a.startDateTime && b.startDateTime) {
	// 			return Date.parse(a.startDateTime) - Date.parse(b.startDateTime);
	// 		} else if (a.isTask && !b.isTask) {
	// 			return 1;
	// 		} else {
	// 			return -1;
	// 		}
	// 	});

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
				console.log('data', data);
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
		completeTask: async (event: EventType) => {
			var completedAt: Date | undefined;
			if (!event.completed) {
				if (!completeTodoistTask(event.id)) return;
				event.completedAt = new Date().toISOString();
				event.completed = true;
			} else {
				if (!reopenTodoistTask(event.id)) return;
				event.completedAt = undefined;
				event.completed = false;
			}

			user.subscribe(async (user) => {
				const { data, error } = await db.events().upsert(event).select();
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
			console.log('editCalendarEvent', event);
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

export const todayTasks = derived(eventStore, (eventStore) => {
	return orderBy(
		eventStore.filter((event) => {
			// check if event is a task, not completed or completed today, and due today or overdue
			if (event.isTask) {
				console.log('is task');
				var todayDate = new Date();
				todayDate.setHours(0, 0, 0, 0);
				var tomorrowDate = new Date(todayDate);
				tomorrowDate.setDate(tomorrowDate.getDate() + 1);

				if (event.completed && event.completedAt) {
					console.log(Date.parse(event.completedAt), todayDate.valueOf());
					if (Date.parse(event.completedAt) < todayDate.valueOf()) return false;
				}
				console.log('is not completed today task');
				if (!event.dueDate) return false;
				console.log('is not no due date task');
				if (Date.parse(event.dueDate) > tomorrowDate.valueOf()) return false;
				console.log('is today task');
				return true;
			}
			return false;
		}),
		['completed','dueDate', 'priority',],
		['asc','asc', 'desc',]
	);
});
