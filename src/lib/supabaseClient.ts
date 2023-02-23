import { createClient } from '@supabase/auth-helpers-sveltekit'
import { env } from '$env/dynamic/public'
import type { EventType, ProjectType } from './types/types';
// or use the static env
// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabaseClient = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)

export const db = {
	events: () => supabaseClient.from('events'),
	projects: () => supabaseClient.from('projects'),
};