import { createClient } from '@supabase/supabase-js';
import { insert } from 'svelte/internal';

type SupaTable =
	| 'profiles'
	| 'Artist'
	| 'Artist_Relation'
	| 'Honor'
	| 'Honor_Relation'
	| 'Boardgame'
	| 'Category'
	| 'Category_Relation'
	| 'Comment'
	| 'Content'
	| 'Creator'
	| 'Creator_Relation'
	| 'Designer'
	| 'Designer_Relation'
	| 'Event'
	| 'Event_Relation'
	| 'Graphicdesigner'
	| 'Graphicdesigner_Relation'
	| 'Mechanics'
	| 'Mechanics_Relation'
	| 'Manufacturer'
	| 'Manufacturer_Relation'
	| 'Person'
	| 'Place'
	| 'Place_Relation'
	| 'Playtester'
	| 'Playtester_Relation'
	| 'Publisher'
	| 'Publisher_Relation'
	| 'Shop'
	| 'Shop_Relation'
	| 'Sponsor'
	| 'Sponsor_Relation'
	| 'Type'
	| 'Type_Relation'
	| 'Admin_Settings';
type SupaStorageBucket = 'avatars' | 'images' | 'public';

// TODO: not hard-code this?
// use env variables, somehow?
// VITE_SUPABASE_URL ends with .co, not .in
const DIR_IMAGE = 'https://llhkvvndjjpbdtdvxnvn.supabase.in/storage/v1/object/public/images/';
const DEFAULT_IMAGE_FILE = 'no_cover.jpg';

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
	return DIR_IMAGE + `${type}/` + (url || DEFAULT_IMAGE_FILE);
}

/**
 * Load image from a public folder in images/
 * @param {String} type
 * @returns {String}
 */
export function getDefaultImageURL(type: string): string {
	return DIR_IMAGE + `${type}/` + DEFAULT_IMAGE_FILE;
}

type SubmissionType = 'create' | 'edit' | 'report';
interface submissionData {
	type: SubmissionType;
	content: any;
	relations: Record<string, string[]>;
	pageType: string;
	id: string;
	username: string;
	comment: string;
}

/**
 * add the submission to supabase table
 * NOTE: this should only runs on server (aka. api/post)
 * @param {submissionData} submissionData of object. see above
 * @returns {Promise} promise object with {status: ..., message: ...}
 */
export async function addToSubmission(
	submissionData: submissionData,
	requireApproval: boolean
): Promise<Record<string, any>> {
	// find a new unique ID for this submission
	const IDColumn = 'id';
	const index = await findNewUniqueID('Submission', IDColumn);
	const newSubmission = {
		id: index,
		Submission_type: submissionData.type,
		Submission_content: JSON.stringify(submissionData.content),
		Submission_relations: JSON.stringify(submissionData.relations),
		Submission_page_type: submissionData.pageType,
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
		const res = await addToDatabase(
			newSubmission.Submission_content,
			newSubmission.Submission_page_type,
			newSubmission.Submission_type
		);
		await addToDatabaseRelation(
			newSubmission.Submission_relations,
			newSubmission.Submission_page_type,
			newSubmission.Submission_type,
      	res.body.index
		);
  	}

	return { status: 202, body: 'successful' };
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
	name_th: string
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
    Boardgame: [{id: 1, TBG_name: 'fun game', TBG_name_th: null}, ...],
    Contentcreator: [{id: 3, Contentcreator_name: 'Zemaki', Contentcreator_name_th: null}, ...]
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
			const relationTableName = (type === 'person' || relationType === 'person') 
				? 'Person' 
				: getTableName(mainRelation) + '_Relation';
			const relationVarPrefix = getVarPrefix(relationType)
			
			/*
			presumably many more lines
			*/

			// Finally, we can create and insert a new row
			for (const relation of relationObjects) {
				const relationIndex = await findNewUniqueID(relationTableName, 'id');

				let insertObject: Object = {}
				if(relationTableName === 'Person')
					insertObject = {
						[relationVarPrefix + '_ID']: relation.id,
						[varPrefix + '_ID']: index
					};
				else
					insertObject = {
						id: relationIndex,
						[relationVarPrefix + '_ID']: relation.id,
						[varPrefix + '_ID']: index
					}
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
		for (const relationType of Object.keys(relationArrays)) {
			const relationObjects: Relation[] = relationArrays[relationType];

			// TODO: make sure to check all cases
			const mainRelation = relationType === 'boardgame' ? type : relationType; // swap
			const relationTableName = (type.toLocaleLowerCase() === 'person' || relationType.toLocaleLowerCase() === 'person') 
				? 'Person' 
				: getTableName(mainRelation) + '_Relation';
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
async function findNewUniqueID(type: string, column: string): Promise<number> {
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
