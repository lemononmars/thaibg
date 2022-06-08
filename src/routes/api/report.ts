import { from } from '$lib/supabase';

export async function get() {
	const { data, error } = await from('Report').select('*')
	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};
}
