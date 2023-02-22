import type { EventType } from '$lib/types/event.type';
import type { ProjectType } from '$lib/types/project.type';
import { supabaseClient } from '$lib/supabaseClient';
import { user } from '$lib/store/stores';
import { page } from '$app/stores';

import { writable, type Writable } from 'svelte/store';

function createProjects(initial: ProjectType[]) {
	const { subscribe, set, update } = writable(initial);

	return {
		subscribe,
		loadProjects: async () => {
			const { data, error } = await supabaseClient.from('projects').select('*');
			if (error) {
				console.log('error', error);
			} else {
				console.log('data', data);
				set(data);
			}
		},
		addProject: async (project: ProjectType) => {
			user.subscribe(async (user) => {
				const { data, error } = await supabaseClient
					.from('projects')
					.upsert({
						id: project.id,
						name: project.name,
						todoistId: project.todoistId,
						todoistURL: project.todoistURL,
						calendarId: project.calendarId,
						calendarName: project.calendarName,
						color: project.color,
						user_id: user.id
					})
					.select();
				if (error) {
					console.log('error', error);
				} else {
					console.log('data', data);
					update((projects) => {
            if (projects) {
              if (projects.find((i) => i.id === data[0].id)) {
                return projects.map((i) => {
                  if (i.id === data[0].id) {
                    return data[0];
                  }
                  return i;
                });
              } else {
                return [...projects, data[0]];
              }
            }
            return [data[0]];
          });
				}
			});
		}
	};
}

export const projectStore = createProjects([]);
