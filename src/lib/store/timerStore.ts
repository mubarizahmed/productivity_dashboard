import type { TimerType } from '$lib/types/types';
import { writable } from 'svelte/store';
import { page } from '$app/stores';
import { user, currentTimer } from './stores';
import { db } from '$lib/supabaseClient';

function createTimers(initial: TimerType[]) {
	const { subscribe, set, update } = writable<TimerType[]>(initial);

	const upsertTimer = (timer: TimerType) => {
		update((timers) => {
			if (timers) {
				if (timers.find((i) => i.id === timer.id)) {
					return timers.map((i) => {
						if (i.id === timer.id) {
							return timer;
						}
						return i;
					});
				} else {
					return [...timers, timer];
				}
			}
			return [timer];
		});
	};

	const addTimer = (timer: TimerType) => {
		user.subscribe(async (u) => {
			timer.user_id = u.id;
			const { data, error } = await db.timers().upsert(timer).select();
			if (error) {
				console.log('error', error);
			} else {
				console.log('data', data);
				upsertTimer(data[0]);
			}
		});
	};

	return {
		subscribe,
		addTimer,
		loadTimers: async () => {
			const { data, error } = await db.timers().select();
			if (error) {
				console.log('error', error);
			} else {
				console.log('data', data);
				set(data);
			}
		},
		startTimer: async (taskId: string, startedAt: Date) => {
			user.subscribe(async (u) => {
        console.log('startTimer', taskId, startedAt, u.id);
				const { data, error } = await db.timers().insert({ eventId: taskId, startedAt: startedAt, user_id: u.id }).select();
				if (error) {
					console.log('error', error);
				} else {
					console.log('data', data);
          var timer: TimerType = data[0];
					upsertTimer(timer);
          currentTimer.set(timer);
				}
			});
		},
    stopTimer: async (timer: TimerType) => {
      user.subscribe(async (u) => {
        console.log('stopTimer', timer, u.id);
        const { data, error } = await db.timers().update({ stoppedAt: new Date(), pausedDuration: timer.pausedDuration, user_id: u.id }).eq('id', timer.id).select();
        if (error) {
          console.log('error', error);
        } else {
          console.log('data', data);
          upsertTimer(data[0]);
          currentTimer.clear();
        }
      });
    }
	};
}

export const timerStore = createTimers([]);