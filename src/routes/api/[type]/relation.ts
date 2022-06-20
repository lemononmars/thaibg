import { from, getTableName, getVarPrefix } from '$lib/supabase';
import { BoardgameRelationArray } from '$lib/datatypes';

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
export async function get({ params }) {
	let { type } = params;
	if(!type) return

	type = type.toLowerCase()
	const typePrefix = getVarPrefix(type)
	if (!BoardgameRelationArray.includes(type) && type !== 'content_contentcreator')
		return {
			status: 404,
			body: { message: 'cannot parse either type or relation.' }
		};

	const tableName = `${getTableName(type)}_Relation`
	const { data, error } = await from(tableName)
		.select('*')

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
