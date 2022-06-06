import { from } from '$lib/supabase';

export async function get() {
	const { data } = await from('Submission').select(
		'Submission_page_type,Submission_username,Submission_type,Submission_content,Submission_date,Submission_status,Submission_page_ID'
	);

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};
}
