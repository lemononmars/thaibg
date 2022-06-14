import { createClient } from '@supabase/supabase-js';
import { personRoles } from './datatypes';

type SupaStorageBucket = 'avatars' | 'images' ;

// TODO: not hard-code this?
// use env variables, somehow?
// VITE_SUPABASE_URL ends with .co, not .in
const DIR_IMAGE = 'https://llhkvvndjjpbdtdvxnvn.supabase.in/storage/v1/object/public/images/';
const DEFAULT_IMAGE_FILE = 'default.jpg';

export const supabaseClient = createClient(
	String(import.meta.env.VITE_SUPABASE_URL),
	String(import.meta.env.VITE_SUPABASE_ANON_KEY)
);

/**
 * Convenience re-exports for typed selections
 *
 */
export const auth = supabaseClient.auth;
export const storage = supabaseClient.storage;
/**
 *
 * @param table The Supabase table to act upon
 * @returns {data, error}
 */
export const from = (table: string) => supabaseClient.from(table);
/**
 *
 * @param bucket The Supabase storage bucket to act upon
 * @returns
 */
export const fromBucket = (bucket: SupaStorageBucket) => supabaseClient.storage.from(bucket);

/*
 * c
 */
export function getTableName(type: string): string {
	return type[0].toUpperCase() + type.slice(1);
}

/**
 * Return the conresponding prefix to be used with database
 * @param {String} type type of object (e.g. boardgame, person, mechanics)
 * @returns {String} (e.g. TBG, Person, Mech)
 */
export function getVarPrefix(type: string): string {
	if (type?.toLowerCase() === 'boardgame') return 'TBG';
	else if (type?.toLowerCase() === 'mechanics') return 'Mech';
	else return type[0].toUpperCase() + type.slice(1);
}

/**
 * Load image from a public folder in images/
 * @param {String} type type of object (e.g. boardgame, person)
 * @param {String} url url, usually obtained from TBG_picture
 * @returns {String}
 */
export function getImageURL(type: string, url: string): string {
	if(personRoles.includes(type))
		type = 'person'
	// in case user submit prefix name instead
	if(type === 'TBG')
		type = 'boardgame'
	return DIR_IMAGE + `${type.toLowerCase()}/` + (url || DEFAULT_IMAGE_FILE);
}

/**
 * Load image from a public folder in images/
 * @param {String} type
 * @returns {String}
 */
export function getDefaultImageURL(type: string): string {
	if(personRoles.includes(type))
		type = 'person'
	return DIR_IMAGE + `${type}/` + DEFAULT_IMAGE_FILE;
}

export function generateSlug(name: string) {
   if(!name || name.length == 0)
      return 'no-slug'

   return name
      .toLowerCase()
      .replace(/\s/g, '-') // replace white spaces by dashes
      .replace(/[^\w\-]/g, '') // remove non alphanumeric characters (except dashes of course)
}

/**
 * upload a file to /public/images
 * @param {String} type type of object (e.g. boardgame, person)
 * @param {String} file picture file (File)
 * @param {String} slug object's slug
 * @returns {String} file name
 */
export async function uploadPicture(type: string, file: File, slug: string): Promise<string> {
	// TODO: convert file? resize?
	const randomID = Math.floor(Math.random() * 1000);
	const randomIDString = ('000' + randomID).slice(-4);
	const pictureSlug = slug + '-' + randomIDString;

	// TODO: check if file already exists and repalce instead?
	let { error: updateError } = await fromBucket('images').upload(
		`${type}/${pictureSlug}`,
		file,
		{
			upsert: false
		}
	);

	if (updateError) throw updateError;
	return pictureSlug
}

type SubmissionType = 'new' | 'edit' | 'report';

/*
	define the shape of the data submitted from the webpage
*/
export interface SubmissionData {
	type: SubmissionType;
	content: any;
	rolesSubmission: Record<string, any[]>;
	relations: Record<string, any[]>;
	pageType: string;
	id: string;
	username: string;
	comment: string;
}

/**
 * add the submission to supabase table
 * NOTE: this should only runs on server (aka. api/post)
 * @param {SubmissionData} submissionData of object. see above
 * @returns {Promise} promise object with {status: ..., message: ...}
 */
export async function addToSubmission(
	submissionData: SubmissionData,
	requireApproval: boolean
): Promise<Record<string, any>> {

	// find a new unique ID for this submission
	const IDColumn: string = 'id';
	const submissionIndex = await findNewUniqueID('Submission', IDColumn);
	const pageType = submissionData.pageType
	let index: number

	// create an object to be added to the database table
	let newSubmission = {
		id: submissionIndex,
		Submission_type: submissionData.type, // new, edit, report
		Submission_content: JSON.stringify(submissionData.content),
		Submission_relations: JSON.stringify(submissionData.relations),
		Submission_page_type: pageType,
		Submission_page_ID: submissionData.type === 'new'? null: submissionData.content[getVarPrefix(pageType) + '_ID'],
		Submission_user_ID: submissionData.id,
		Submission_username: submissionData.username,
		Submission_comment: submissionData.comment,
		Submission_date: new Date(),
		Submission_status: requireApproval? 'pending' : 'accepted'
	}

	const { error } = await from('Submission').insert([
		newSubmission
	], {
   	returning: 'minimal'
  	});
	if (error) return { status: 500, body: error };

	// if admin approval is not require, also add it to the database
	if(!requireApproval) {
		// when creating a new person or organization, we also create new roles from extra submissions
		if(pageType === 'person' || pageType === 'organization') {
			let rolesContent = {}
			for(const role of Object.keys(submissionData.rolesSubmission)) {
				const rolePrefix = getVarPrefix(role)
				// need to create an array because there can be multiple roles for each organization
				if(pageType === 'organization')
					rolesContent[role] = []
				for(const data of submissionData.rolesSubmission[role]) {
					// it is possible that you edit a person, while also adding new roles
					// in this case, we determine whether to add or edit role by looking at relations
					// person: find ROLE_ID in Person table
					// organization: find ROLE_ID in data (about to be submitted)
					let roleSubmissionType: string = data[rolePrefix + '_ID'] ? 'edit' : 'new'
					const res = await addToDatabase(
						JSON.stringify(data),
						role,
						roleSubmissionType
					);

					if(pageType === 'organization')
						rolesContent[role] = [
							...rolesContent[role],
							roleSubmissionType === 'new' ? res.body.index : data[rolePrefix + '_ID']
						]
					else if(roleSubmissionType === 'new')
						rolesContent[rolePrefix + '_ID'] = res.body.index
				}
			}
			// match the shape for database table
			if(pageType === 'organization')
				rolesContent = {
					Organization_relation: JSON.stringify(rolesContent)
				}
			newSubmission.Submission_content = JSON.stringify({
				...JSON.parse(newSubmission.Submission_content),
				...rolesContent
			})
		}
		// we add the person or organization after roles because we want to add new role IDs at once
		const res = await addToDatabase(
			newSubmission.Submission_content,
			newSubmission.Submission_page_type,
			newSubmission.Submission_type
		);
		index = res.body.index
		
		// finally, we add relational data if any
		if(newSubmission.Submission_relations) 
			await addToDatabaseRelation(
				newSubmission.Submission_relations,
				newSubmission.Submission_page_type,
				newSubmission.Submission_type,
				index
			);
  	}

	return { 
		status: 202, 
		body: {
			message: 'successful',
			index
		}
	};
}

// happen on admin page
// after admin makes a judgement, do the job
export async function changeSubmissionStatus(
	id: number,
	newStatus: string
): Promise<Record<string, any>> {
	// retrieve only submission status and type for now
	const { data: metadata } = await from('Submission')
		.select('Submission_status, Submission_type')
		.eq('id', id)
		.single();

	// make sure it hasn't been approved already
	if (newStatus === 'approved' && metadata.Submission_status !== 'approved') {
		const { data, error } = await from('Submission')
			.select('Submission_content, Submission_page_type, Submission_relations')
			.eq('id', id)
			.single();
		if (error) return { status: 500, body: error };

		const res = await addToDatabase(
			data.Submission_content,
			data.Submission_page_type,
			metadata.Submission_type
		);
		await addToDatabaseRelation(
			data.Submission_relations,
			data.Submission_page_type,
			metadata.Submission_type,
      	res.body.index
		);
	}

	// update submission status
	const { error } = await from('Submission')
		.update([
			{
				Submission_status: newStatus
			}
		])
		.eq('id', id);
	if (error) return { status: 500, body: error };

	// if the status is changed to reject or pending, do not delete the submission yet
	// keep it for future reference

	return { status: 202, body: 'successful'};

	// TODO: deal with reject, for any reason (like bad data, incomplete entries, etc)
}

async function addToDatabase(
	JSONstring: string,
	type: string, 
	submissionType: string
): Promise<Record<string, any>> {
	const parse = JSON.parse(JSONstring);
	if (submissionType === 'new') {
		const IDColumn = getVarPrefix(type) + '_ID';
		const index = await findNewUniqueID(type, IDColumn);
		const { error: newError } = await from(getTableName(type)).insert(
			[
				{
					...parse,
					[IDColumn]: index
				}
			],
			{
				returning: 'minimal'
			}
		);
		if (newError) throw newError;

		return { 
			status: 201, 
			body: {
				message: 'new entry created',
				index
			}
	 	};
	}

  // in case of edit,
  // we can simply upsert the new entry
  // the ID of the data should have been passed from edit page already
	if (submissionType === 'edit') {
		const { error: editError } = await from(getTableName(type)).upsert([parse], {
			returning: 'minimal'
		});
		if(editError)
			return { 
				status: 500, 
				body: {
					message: editError.message,
				}
			};
		return { 
			status: 202, 
			body: {
				message: 'entry updated',
				index: parse[getVarPrefix(type) + '_ID']
			}
		};
	}
}

interface Relation {
	id: number,
	name: string,
	name_th?: string
}

async function addToDatabaseRelation(
	JSONstring: string,
	type: string,
	submissionType: string,
	index: number
) {
	/*
	index = type index (eg. boardgame/99)
  relationArrays has the shape
  {
    boardgame: [{id: 1, TBG_name: 'fun game', TBG_name_th: null}, ...],
    contentcreator: [{id: 3, Contentcreator_name: 'Zemaki', Contentcreator_name_th: null}, ...]
  }

    relationType - Boardgame
    relationObjects - [{id: 1, TBG_name: 'fun game'}, ...]
    relation - {id: 1, TBG_name: 'fun game'}
  */
	const relationArrays = JSON.parse(JSONstring);
	const varPrefix = getVarPrefix(type)

	// for new entries, simply create new rows
	if(submissionType === 'new') {
		for (const relationType of Object.keys(relationArrays)) {
			const relationObjects: Relation[] = relationArrays[relationType];

			// TODO: make sure to check all cases
			const mainRelation = relationType === 'boardgame' ? type : relationType; // swap
			// special case 1: person -> add to Person table directly
			// special case 2: content-contentcreator -> add to Content_Contentcreator_Relation
			const relationTableName = (type === 'person' || relationType === 'person') 
				? 'Person' : (type === 'content' && relationType === 'contentcreator') || (type === 'contentcreator' && relationType === 'content')
				? 'Content_Contentcreator_Relation'
				:getTableName(mainRelation) + '_Relation';
			const relationVarPrefix = getVarPrefix(relationType)

			// Finally, we can create and insert a new row
			for (const relation of relationObjects) {
				const relationIndex = await findNewUniqueID(relationTableName, 'id');

				let insertObject: Object = {
					[relationVarPrefix + '_ID']: relation.id,
					[varPrefix + '_ID']: index
				};
				if(relationTableName === 'Person')
					insertObject['Person_ID'] = relationIndex
				else
					insertObject['id'] = relationIndex

				const { error } = await from(relationTableName).upsert([insertObject], {
					returning: 'minimal'
				});
				if (error) throw error;
			}
		}

		return {
			status: 200,
			body: {
				message: 'relational data are added successfullly!'
			}
		}
	}

	// this is where things get complicated ....
	if(submissionType === 'edit') {
		// special case for organization:
		// simply replace the array (or rather stringified version)
		if(type === 'organization') {
			let newRelationObject = {}
			// final result should be 
			// {"publisher": [1,20], "shop": [0]}
			for (const relationType of Object.keys(relationArrays))
				newRelationObject[relationType] = relationArrays[relationType].map((r: Relation) => r.id) 

			const insertObject = {
				Organization_ID: index,
				Organization_relation: JSON.stringify(newRelationObject)
			}
			await from('Organization')
				.upsert([
					insertObject
				])
		}
		// otherwise, we need to add relational datas to multiple tables
		else {
			for (const relationType of Object.keys(relationArrays)) {
				const relationObjects: Relation[] = relationArrays[relationType];

				// yet another special case for organization
				if(relationType === 'organization') {
					// look at each organiation that we are supposed to add
					for (const relation of relationObjects)  {
						const {data: oldData} = await from('Organization')
							.select('Organization_relation')
							.eq('Organization_ID', relation.id)

						let oldDataObject = JSON.parse(oldData[0].Organization_relation)

						// if that entry doesn't exist yet, append it to the existing array
						if(!oldDataObject[type]?.includes(index)) {
							oldDataObject[type] = [...oldDataObject[type], index]
			
							const insertObject = {
								Organization_ID: relation.id,
								Organization_relation: JSON.stringify(oldDataObject)
							}
							await from('Organization')
								.upsert([
									insertObject
								])
						}
					}
				}

				// TODO: make sure to check all cases
				const mainRelation = relationType === 'boardgame' ? type : relationType; // swap
				const relationTableName = (type === 'person' || relationType === 'person') 
					? 'Person' : (type === 'content' && relationType === 'contentcreator') || (type === 'contentcreator' && relationType === 'content')
					? 'Content_Contentcreator_Relation'
					:getTableName(mainRelation) + '_Relation';
				const relationVarPrefix = getVarPrefix(relationType)

				// retrieve current data so that we can decide
				// whether to add or remove each entry
				const {data: currentRelationObjects} = await from(relationTableName).select('*').eq(`${varPrefix}_ID`, index)

				// First, delete entries
				// i.e. in the table, but not in the submission
				if(currentRelationObjects)
					for (const currentRelation of currentRelationObjects) {
						if(!relationObjects || relationObjects.some(r => 
							r.id == currentRelation[relationVarPrefix + '_ID']
						))
							continue;

						// for person, do not remove the row
						// make the corresponding entry null instead
						if(relationTableName === 'Person') {
							let insertObject: Record<string, number> = {}
							if(type === 'person') {
								insertObject['Person_ID'] = index
								insertObject[relationVarPrefix + '_ID'] = null
							}
							else {
								insertObject['Person_ID'] = currentRelation['Person_ID']
								insertObject[varPrefix + '_ID'] = null
							}
							const {error} = await from(relationTableName)
								.upsert([
									insertObject
								])
						}
						else {
							const { error } = await from(relationTableName)
								.delete()
								.eq('id', currentRelation.id);
							if (error) throw error;
						}
					}

				// Then, add new entries
				// i.e. in the submission, but not already in the table
				if(relationObjects)
					for (const relation of relationObjects) {
						if(!currentRelationObjects || currentRelationObjects.some(cr => 
							cr[relationVarPrefix + '_ID'] == relation.id
						))
							continue;

						let insertObject: Object = {}
						// when adding person relation, do not add a new row
						if(relationTableName === 'Person')
							insertObject = {
								[relationVarPrefix + '_ID']: relation.id,
								[varPrefix + '_ID']: index
							};
						else {
							const relationIndex = await findNewUniqueID(relationTableName, 'id');
							insertObject = {
								id: relationIndex,
								[relationVarPrefix + '_ID']: relation.id,
								[varPrefix + '_ID']: index
							}
						}

						const { error } = await from(relationTableName).upsert([insertObject], {
							returning: 'minimal'
						});
						if (error) throw error;
					}
			}
		}
		return {
			status: 200,
			body: {
				message: 'relational data are added successfullly!'
			}
		}
	}
}


/**
 * find the next available id to add to the table.
 * (note: supabase doesn't have autoincrement)
 * @param {String} type type of object (e.g. boardgame, person, mechanics)
 * @param {String} column the column to be searched: [PREFIX_ID] for regular table, or [id] for relational table
 * @returns {Promise<number>} available index
 */
export async function findNewUniqueID(type: string, column: string): Promise<number> {
	let { data: idData, error: idError } = await from(getTableName(type)).select(column);
	if (idError) throw idError;
	let sortedData = idData.map((c) => c[column]).sort((a, b) => a - b);
	let index = 1;
	const max = sortedData.length;
	let found = false;
	while (!found && index <= max) {
		if (index < sortedData[index - 1]) found = true;
		else index++;
	}
	return index;
}
