import type { EventType } from '$lib/types/event.type';
import type { ProjectType } from '$lib/types/project.type';
import { writable, type Writable } from 'svelte/store';
import { persistBrowserLocal } from '@macfja/svelte-persistent-store';
import type { User } from '@supabase/supabase-js';
import type { TimerType } from '$lib/types/types';

// export let projects = <ProjectType>(initial: []) => {
function createProjects(initial: ProjectType[]) {
	const { subscribe, set, update } = persistBrowserLocal(writable(initial), 'pd-projects');

	return {
		subscribe,
    addProject: (project: ProjectType) => {
			update((projects) => {
				if (projects) {
          if (projects.find((i) => i.id === project.id)) {
            return projects.map((i) => {
              if (i.id === project.id) {
                return project;
              }
              return i;
            });
          } else {
            return [...projects, project];
          }
				}
				return [project];
			});
		},
		clear: () => set([])
	};
}

function createEvents(initial: EventType[]) {
	const { subscribe, set, update } = persistBrowserLocal(writable(initial), 'pd-events');

	return {
		subscribe,
		addCalendarEvent: (event: EventType) => {
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
		},
    addTodoistTask: (task: EventType) => {
      console.log('addTodoistTask');
      update((events) => {
        if (events) {
          if (events.find((i) => i.id === task.id)) {
            console.log('found task');
            return events.map((i) => {
              if (i.id === task.id) {
                return task;
              }
              return i;
            });
          } else {
            return [...events, task];
          }
        }
        return [task];
      });
    },
    completeTodoistTask: (eventId: string) => {
      console.log('completeTodoistTask');
      update((events) => {
        return events.map((i) => {
          if (i.id === eventId) {
            i.completed = !i.completed;
            return i;
          }
          return i;
        });
      });
    },
		clear: () => set([])
	};
}

function createTokenClient (){
  const { subscribe, set, update } = persistBrowserLocal(writable(null), 'pd-token-client');

  return {
    subscribe,
    set,
    update
  }
}

function createCurrentTimer() {
  const { subscribe, set, update } = writable<TimerType>();

  return {
    subscribe,
    set,
    update,
    clear: () => set()
  }
}


export let events = createEvents([]);
export const projects = createProjects([]);
export const tokenClient = createTokenClient();

export const user = writable<User>();
export const currentTimer = createCurrentTimer();

export const calendars = writable({
  'primary': 'primary',
  'classes': '8tciba5ockfvb8rklc4hppqqao@group.calendar.google.com',
  'planner':
    '4ae44282c14f6b5f93b3881395d3be21ef30c90e45a5c5d1512d456d403563bc@group.calendar.google.com'
});