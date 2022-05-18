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
/** @type {import('/api/[type]/[id]/[relation]').RequestHandler} */
export async function get({ url, params }) {
	let { type, id, relation } = params;

	// sanitize
	// make sure 'type' is correct
	if (
		(!TypeNamesArray.includes(type?.toLowerCase()) ||
			!TypeNamesArray.includes(relation?.toLowerCase())) &&
		relation !== 'relation'
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
				.map((str: string) => getVarPrefix(type) + '_' + str)
				.join(',')
		: '*';

	if (type === 'person') {
		const { data, error } = await from(getTableName(relation))
			.select(`${selectedColumns}, Person!inner(*)`)
			.eq(`Person.${getVarPrefix(relation)}_ID`, id);

		if (error)
			return {
				status: 404,
				body: {message: `No ${relation} associated with this person found`}
			};
		else
			return {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: data
			};
	}

	// for organizations.... well
	if (type === 'organization') {
		// const { data, error } = await from(getTableName(relation))
		// 	.select(`${selectedColumns}, Person!inner(*)`)
		// 	.eq(`Person.${getVarPrefix(relation)}_ID`, id);

		// if (error)
		// 	return {
		// 		status: 404,
		// 		body: {message: `No ${relation} associated with this person found`}
		// 	};
		// else
			return {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: [{}]
			};
	}

	// in case of /api/designer/9/boardgame
	// we'll look up Designer_Relation, not Boardgame_Relation
	// similary, for /api/content/9/contentcreator
	// we look up Content_Relation
	if (relation === 'boardgame' || (relation === 'contentcreator' && type === 'content'))
		relation = type;

	// in case of
	// everything else stays the same
	const selectStr = `${selectedColumns}, ${getTableName(relation)}_Relation!inner(*)`;
	const eqStr = `${getTableName(relation)}_Relation.${getVarPrefix(type)}_ID`;
	const { data, error } = await from(getTableName(params.relation))
		.select(selectStr)
		.eq(eqStr, id);

	if (error)
		return {
			status: 404,
			body: { message: `No ${relation} associated with ${type} found`, error: error }
		};
	else
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: data
		};
}
