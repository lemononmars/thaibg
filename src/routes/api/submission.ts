import { from } from '$lib/supabase';

export async function get() {
	const { data } = await from('Submission').select(
		'Submission_page_type,Submission_username,Submission_type,Submission_content,Submission_date,Submission_status'
	);

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};
}
