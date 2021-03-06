import { from, getTableName, getVarPrefix } from '$lib/supabase';
import { personRoles, TypeNamesArray } from '$lib/datatypes';

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
				.map((str: string) => getVarPrefix(relation) + '_' + str)
				.join(',')
		: '*';

	if (type === 'person') {
		const { data, error } = await from(getTableName(relation))
			.select(`${selectedColumns}, Person!inner(*)`)
			.eq(`Person.Person_ID`, id);
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

	// for organizations, look up in Organization_array
	if (type === 'organization') {
		const { data, error } = await from('Organization')
			.select('Organization_relation')
			.eq('Organization_ID', id)
			.single()
		if (error)
			return {
				status: 404,
				body: {message: `No ${relation} associated with this organization found`}
			};
		
		// orgData = [1, 3, 15]
		const orgData = JSON.parse(data.Organization_relation[relation])
		let newData: Record<string, any>[] = []

		if(!orgData)
			return {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: []
			};

		for(const d of orgData) {
			const {data: data1, error: error1} = await from(getTableName(relation))
				.select(`${selectedColumns}`)
				.eq(`${getVarPrefix(relation)}_ID`, d)
				.single()
			newData = [...newData, data1]
		}	
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: newData
		};
	}

	// look up in organization array
	if (relation === 'organization') {
		let { data, error } = await from('Organization')
			.select('*')

		if (error)
			return {
				status: 404,
				body: {message: `No organization associated with this organization found`}
			};
		
		let newData: Record<string, any>[] = []
		// search all organiation whose Organization_relation contains the ID
		for(const org in data) {
			data[org].Organization_relation = JSON.parse(data[org].Organization_relation)
			const orgRelation = data[org].Organization_relation[type]
			if(orgRelation?.includes(parseInt(id))) {
				newData = [...newData, data[org]]
			}
		}
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: newData
		};
	}

	// In case of /api/designer/9/boardgame
	// we'll look up Designer_Relation, not Boardgame_Relation
	if (relation === 'boardgame')
		relation = type;
	// However, for /api/content/9/contentcreator
	// we look up Content_Contentcreator_Relation
	// since Content_Relation is reserved for boardgame-related content
	if ((relation === 'contentcreator' && type === 'content') || (relation === 'content' && type === 'contentcreator'))
		relation = 'content_Contentcreator'
	// in case of
	// everything else stays the same
	const selectStr = `${selectedColumns}, ${getTableName(relation)}_Relation!inner(*)`;
	const eqStr = `${getTableName(relation)}_Relation.${getVarPrefix(type)}_ID`;

	let dataTemp, errorTemp
	// MUST USE params.relation
	// since relation might have been changed
	if(id > 0 || (type === 'shop' || type === 'contentcreator')) {
		const {data , error } = await from(getTableName(params.relation))
			.select(selectStr)
			.eq(eqStr, id);
		dataTemp = data
		errorTemp = error
	}
	else {
		const { data, error } = await from(getTableName(params.relation))
			.select(`${selectedColumns}`)
		if(!error) {
			// get all existing indices and then filter them out
			const { data: relationData } = await from(getVarPrefix(type) + '_Relation')
				.select(`${getVarPrefix(params.relation)}_ID`)

			const existingIndices = new Set(relationData.map((r) => 
				r[`${getVarPrefix(params.relation)}_ID`])
			)
			existingIndices.delete(0) // in case 'uncredited' has already been added

			dataTemp = data.filter(d => 
				!existingIndices.has(d[`${getVarPrefix(params.relation)}_ID`])
			)
		}
	}

	if (errorTemp)
		return {
			status: 404,
			body: { message: `No ${relation} associated with ${type} found`, error: errorTemp }
		};
	else
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: dataTemp
		};
}
