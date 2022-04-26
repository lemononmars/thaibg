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
export async function get({ url, params }) {
	let { type, id, relation } = params;
	relation = params.relation?.toLowerCase() || '';

	// sanitize
	// make sure 'type' is correct
	if (
		(!TypeNamesArray.includes(type?.toLowerCase()) ||
			!TypeNamesArray.includes(relation?.toLowerCase())) &&
		relation !== 'relation'
	)
		return {
			//status: 404,
			message: `${type} is not a valid type`,
			body: { message: 'cannot parse either type or relation.' }
		};

	// pick only selected columns
	const selected = url.searchParams.get('select');
	const selectedColumns = selected
		? selected
				.split(',')
				.map((str) => getVarPrefix(type) + '_' + str)
				.join(',')
		: '*';

	// first, return the pure relational table (without inner join) if the user requests just that
	// ex. artist/2/relation
	// note that all queries are ignored
	if (relation === 'relation') {
		const { data, error } = await from(`${getTableName(type)}_Relation`)
			.select(selectedColumns)
			.eq(`${getTableName(type)}_Relation.${getVarPrefix(type)}_ID`, params.id);

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

	// in case of a person, we'll look up directly in ${role} table, not ${role}_Relation
	if (relation === 'person') {
		const { data, error } = await from('Person')
			.select(`${selectedColumns}, ${getTableName(type)}!inner(*)`)
			.eq(`${getTableName(type)}.${getVarPrefix(type)}_ID`, params.id);

		if (error)
			return {
				status: 404,
				message: `No person associated with ${type} found`
			};
		else
			return {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: data
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
		.eq(eqStr, params.id);

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
