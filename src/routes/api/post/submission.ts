import { addToSubmission, from } from '$lib/supabase';
import { sendhook} from '$lib/discord'
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const content = await request.json()
	const {pageType, username, type} = content
	const hookMessage = ':game_die: ' + username + ' - ' + type + ' - ' + pageType
	
	let message: string
	try {
		message = sendhook(hookMessage)
	}
	catch (error) {
		return {
			status: 501,
			body: {
				message: JSON.stringify(error) + ' ' + message
			}
		}
	}

	const {data: settings} = await from('Admin_Settings').select('*').single()
	const {requireApproval} = settings
	return await addToSubmission(content, requireApproval)
}