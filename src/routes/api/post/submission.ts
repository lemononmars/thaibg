import { addToSubmission, from } from '$lib/supabase';
import { sendhook} from '$lib/discord'
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const sub = await request.json()
	const {pageType, username, type} = sub
	const hookMessage = ':game_die: ' + username + ' - ' + type + ' - ' + pageType + ' ' + sub.content[pageType + '_name']

	sendhook(hookMessage)
	
	const {data: settings} = await from('Admin_Settings').select('*').single()
	const {requireApproval} = settings
	return await addToSubmission(sub, requireApproval)
}