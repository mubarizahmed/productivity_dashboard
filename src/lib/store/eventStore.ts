import type { EventType } from '$lib/types/event.type';
import type { ProjectType } from '$lib/types/project.type';
import { supabaseClient } from '$lib/supabaseClient';
import { user } from '$lib/store/stores';
import { writable } from 'svelte/store';

function createEvents(initial: EventType[]) {
	const { subscribe, set, update } = writable(initial);
	const upvertEvent = (event: EventType) => {
		update((events) => {
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
			return [event];
		});
	};
	return {
		subscribe,
		loadEvents: async () => {
			const { data, error } = await supabaseClient.from('events').select();
			if (error) {
				console.log('error', error);
			} else {
				console.log('data', data);
				set(data);
			}
		},
		addEvent: async (event: EventType) => {
			user.subscribe(async (user) => {
				const { data, error } = await supabaseClient
					.from('events')
					.upsert({
						id: event.id,
						name: event.name,
						url: event.url,
						projectId: event.project,
						isTask: event.isTask,
						completed: event.completed,
						dueDate: event.dueDate,
						priority: event.priority,
						startDateTime: event.startDateTime,
						endDateTime: event.endDateTime,
						user_id: user.id
					})
					.select();
				if (error) {
					console.log('error', error);
				} else {
					console.log('data', data);
          upvertEvent(data[0]);
				}
			});
		},
		completeTask: async (eventId: string) => {
			user.subscribe(async (user) => {
				const { data, error } = await supabaseClient
					.from('events')
					.upsert({
						id: eventId,
						completed: true,
						user_id: user.id
					})
					.select();
				if (error) {
					console.log('error', error);
				} else {
					console.log('data', data);
					upvertEvent(data[0]);
				}
			});
		},
    deleteEvent: async (eventId: string) => {
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
    },

		clear: () => set([])
	};
}

export const eventStore = createEvents([]);
