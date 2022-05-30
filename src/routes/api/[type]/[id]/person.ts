import { from, getTableName, getVarPrefix } from '$lib/supabase';
import { personRoles } from '$lib/datatypes';

/**
 * Returns the object of
 * ex. /api/boardgame/8/designer
 * will return the list of designers for the board game with TBG_ID = 8
 *
 * @param {string} type object's type
 * @param {number} id object's ID
 * @param {string} relation object's relational
 * @param {string} select selected columns
 * @return {array} an array of objects, or error if the ID doesn't exist
 */
/** @type {import('/api/[type]/[id]/person').RequestHandler} */
export async function get({ url, params }) {
	let { type, id } = params;

	// sanitize
	// make sure 'type' is correct
	if (
		(!personRoles.includes(type?.toLowerCase()))
	)
		return {
			status: 404,
			body: { message: 'cannot parse either type or relation.' }
		};

	// pick only selected columns
	// also add appropriate prefix (e.g. picture => TBG_picture)
	const selected = url.searchParams.get('select');
	const selectedColumns = selected
		? selected
			.split(',')
			.map((str: string) => 'Person_' + str)
			.join(',')
		: '*';

	// in case of a person, we'll look up directly in ${role} table, not ${role}_Relation
	// TODO: properly change it to Person_Relation ???
	const { data, error } = await from('Person')
		.select(`${selectedColumns}, ${getTableName(type)}!inner(*)`)
		.eq(`${getTableName(type)}.${getVarPrefix(type)}_ID`, id);

	if (error)
		return {
			status: 404,
			body: {message: `No person associated with this ${type} found`}
		};
	else
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: data
		};
}
