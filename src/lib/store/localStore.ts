// localStore.ts
import { writable } from 'svelte/store'
import { persistBrowserLocal } from "@macfja/svelte-persistent-store"


export const localStore = <T>(key: string,initial: T) => {          // receives the key of the local storage and an initial value
                // convert to object

  const { subscribe, set, update } = persistBrowserLocal(writable<T>(initial),key)                   // create the underlying writable store

  return {
    subscribe,
    set: (value: T) => {                      // save also to local storage as a string
      return set(value)
    },
    update
  }
}