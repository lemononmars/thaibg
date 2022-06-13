import { from, getTableName, getVarPrefix } from '$lib/supabase';
import { TypeNamesArray } from '$lib/datatypes';

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
/** @type {import('/api/[type]/[id]/relation').RequestHandler} */
export async function get({ url, params }) {
	let { type, id } = params;
	const typePrefix = getVarPrefix(type)
	if (!TypeNamesArray.includes(type?.toLowerCase()))
		return {
			status: 404,
			body: { message: 'cannot parse either type or relation.' }
		};

	const selected = url.searchParams.get('select');
	const selectedColumns = selected
		? selected
			.split(',')
			.map((str: string) =>typePrefix + '_' + str)
			.join(',')
		: '*';

	const tableName = `${getTableName(type)}_Relation`
	const { data, error } = await from(tableName)
		.select(`${selectedColumns}`)
		.eq(`${typePrefix}_ID`, id);

	if (error)
		return {
			status: 404,
			body: { message: `No relationship table for ${type} found`, error }
		};
	else
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: data
		};
}
