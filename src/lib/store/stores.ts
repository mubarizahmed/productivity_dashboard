import type { EventType } from '$lib/types/event.type';
import type { ProjectType } from '$lib/types/project.type';
import type { ProjectArrayType } from '$lib/types/projectArray.type';
import {writable, type Writable} from 'svelte/store';
import { persistBrowserLocal } from "@macfja/svelte-persistent-store"


export let projects = <ProjectType>(initial: ProjectType[]) => {
  const { subscribe, set, update } = writable<ProjectType[]>(initial);

  return {
    subscribe,
    addProject: (project: ProjectType) => {
      update((projects) => [...projects, project])
    },
    clear: () => set([])
  };
}

function createEvents() {
  const { subscribe, set, update } = writable(new Array<EventType>());

  return {
    subscribe,
    addEvent: (event: EventType) => {
      update((events) => [...events, event])
    },
    addTask: (task: TaskType) => {

    },
    clear: () => set([])
  };
}

export let events = createEvents();
