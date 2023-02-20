import type { EventType } from '$lib/types/event.type';
import type { ProjectType } from '$lib/types/project.type';
import { writable, type Writable } from 'svelte/store';
import { persistBrowserLocal } from '@macfja/svelte-persistent-store';

// export let projects = <ProjectType>(initial: []) => {
function createProjects(initial: ProjectType[]) {
	const { subscribe, set, update } = persistBrowserLocal(writable(initial), 'pd-projects');

	return {
		subscribe,
    addCalendarProject: (project: ProjectType) => {
			update((projects) => {
				if (projects) {
          if (projects.find((i) => i.calendarId === project.calendarId)) {
            return projects.map((i) => {
              if (i.calendarId === project.calendarId) {
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
		addTodoistProject: (project: ProjectType) => {
			update((projects) => {
				if (projects) {
          if (projects.find((i) => i.todoistId === project.todoistId)) {
            return projects.map((i) => {
              if (i.todoistId === project.todoistId) {
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


export let events = createEvents([]);
export const projects = createProjects([]);
export const tokenClient = createTokenClient();
