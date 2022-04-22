import { createClient } from '@supabase/supabase-js'

type SupaTable = 'profiles' | 'Artist' | 'Artist_Relation' | 'Honor' | 'Honor_Relation' | 'Boardgame' | 'Category' | 'Category_Relation' | 'Comment' | 'Content' | 'Creator' | 'Creator_Relation' | 'Designer' | 'Designer_Relation' | 'Event' | 'Event_Relation' | 'Graphicdesigner' | 'Graphicdesigner_Relation' | 'Mechanics' | 'Mechanics_Relation' | 'Manufacturer' | 'Manufacturer_Relation' | 
'Person' | 'Place' | 'Place_Relation' | 'Playtester' | 'Playtester_Relation' | 'Publisher' | 'Publisher_Relation' | 'Shop' | 'Shop_Relation' | 'Investor' | 'Investor_Relation' | 'Type' | 'Type_Relation' 
type SupaStorageBucket = 'avatars' | 'images' |'public'

// TODO: not hard-coded this?
const DIR_IMAGE = 'https://llhkvvndjjpbdtdvxnvn.supabase.in/storage/v1/object/public/images/'
const DEFAULT_IMAGE_FILE = 'no_cover.jpg'

export const supabaseClient = createClient(
  String(import.meta.env.VITE_SUPABASE_URL),
  String(import.meta.env.VITE_SUPABASE_ANON_KEY)
)

/**
 * Convenience re-exports for typed selections
 *
 */
export const auth = supabaseClient.auth
export const storage = supabaseClient.storage
/**
 *
 * @param table The Supabase table to act upon
 * @returns {data, error}
 */
export const from = (table: string) => supabaseClient.from(table)
/**
 *
 * @param bucket The Supabase storage bucket to act upon
 * @returns
 */
export const fromBucket = (bucket: SupaStorageBucket) => supabaseClient.storage.from(bucket)

/*
* c
*/
export function getTableName (type: string): string{
  return type[0].toUpperCase() + type.slice(1)
}

/**
 * Return the conresponding prefix to be used with database
 * @param {String} type type of object (e.g. boardgame, person, mechanics)
 * @returns {String} (e.g. TBG, Person, Mech)
 */
export function getVarPrefix (type: string): string{
  if(type?.toLowerCase() === "boardgame")
      return 'TBG'
  else if(type?.toLowerCase() === "mechanics")
    return 'Mech'
  else
    return type[0].toUpperCase() + type.slice(1)
}

/**
 * Load image from a public folder in images/
 * @param {String} type type of object (e.g. boardgame, person)
 * @param {String} url url, usually obtained from TBG_picture
 * @returns {String}
 */
export function getImageURL (type: string, url: string): string {
  return DIR_IMAGE + `${type}/` + (url || DEFAULT_IMAGE_FILE)
}

/**
 * Load image from a public folder in images/
 * @param {String} type
 * @returns {String}
 */
export function getDefaultImageURL (type: string): string {
  return DIR_IMAGE + `${type}/` + DEFAULT_IMAGE_FILE
}


type SubmissionType = 'create' | 'edit' | 'report'
interface submissionData {
  type: SubmissionType,
  content,
  relations: Record<string, string[]>,
  pageType: string,
  id: string,
  username: string,
  comment: string
}
export async function addToSubmission (submissionData: submissionData): Promise<Record<'status', string>>{
  // very bad practice? 
  // better with post?
  const IDColumn = 'id'
  const index = await findNewUniqueID('Submission', IDColumn)

  const {data, error} = await from('Submission')
    .insert([{
      id: index,
      Submission_type: submissionData.type, 
      Submission_content: JSON.stringify(submissionData.content), 
      Submission_relations: JSON.stringify(submissionData.relations), 
      Submission_page_type: submissionData.pageType,
      Submission_user_ID: submissionData.id,
      Submission_username: submissionData.username,
      Submission_comment: submissionData.comment,
      Submission_date: new Date(),
      Submission_status: 'pending',
    }])
   if(error)
      return {status: error.message}

  /* TODO: allow adding directly when needed
  addToDatabase(
    submissionData.Submission_content, 
    submissionData.Submission_pageType,
    submissionData.type
  )
  */
   return {status: 'success'}
}

// happen on admin page
// after admin makes a judgement, do the job
export async function changeSubmissionStatus(id: number, newStatus:string): Promise<Record<'status', string>>{
  // retrieve only submission status and type for now
  console.log('retreiving submission info')
  const{data: data1} = await from('Submission')
    .select('Submission_status, Submission_relations, Submission_type')
    .eq('id', id)
    .single()
  
  console.log(newStatus)
  // make sure it hasn't been approved already 
  if(newStatus === 'approved' && data1.Submission_status !== 'approved') {
    console.log('approved! about to add')
    const {data, error} = await from('Submission')
      .select('Submission_content, Submission_page_type, Submission_relations')
      .eq('id', id)
      .single()
    if(error)
      return {status: error.message}

    const {index, status} = await addToDatabase(data.Submission_content, data.Submission_page_type, data1.Submission_type)
    await addToDatabaseRelation(data.Submission_relations, data.Submission_page_type, data1.Submission_type, index)
  }

  // update submission status
  const{data, error} = await from('Submission')
    .update([{
      Submission_status: newStatus
    }])
    .eq('id', id)
  if(error)
    return {status: error.message}

  // if the status is changed to reject or pending, do not delete the submission yet
  // keep it for future reference

  return {status: 'status changed successfully'}
  
  // TODO: deal with reject
}

async function addToDatabase (JSONstring: string, type: string, submissionType: string): Promise<Record<string, any>> {
  const parse = JSON.parse(JSONstring)
  if(submissionType === 'new') {
    console.log('adding a new entry to database')
    const IDColumn = getVarPrefix(type) + '_ID'
    const index = await findNewUniqueID(type, IDColumn)
    
    console.log(parse, JSONstring, typeof JSONstring)
    console.log(IDColumn, index)
    let {data: newData, error: newError} = await from(getTableName(type))
      .insert([{
        ...parse,
        [IDColumn]: index
      }], {
        returning: "minimal"
      })
    console.log(newData, newError)
    if(newError) throw newError
    return {status: 'new entry created', index}
  }

  if(submissionType === 'edit') {
    let {data: editData, error: editError} = await from(getTableName(type))
      .upsert([parse], {
        returning: "minimal"
      })
    return {status: 'entry updated', index: parse[getVarPrefix(type) + '_ID']}
  }
}


async function addToDatabaseRelation (JSONstring: string, type: string, submissionType: string, index: number) {
  /*
  relationArrays has the shape
  {
    Boardgame: [{id: 1, TBG_name: 'fun game'}, ...],
    Contentcreator: [{id: 3, Contentcreator_name: 'Zemaki'}, ...]
  }

    relationType - Boardgame
    relationObjects - [{id: 1, TBG_name: 'fun game'}, ...]
    relation - {id: 1, TBG_name: 'fun game'}
  */
  console.log(JSONstring)
  console.log(JSON.parse(JSONstring))
  const relationArrays = JSON.parse(JSONstring)
  for(const relationType of Object.keys(relationArrays)) {
    const relationObjects = relationArrays[relationType]
    for(const relation of relationObjects) {
      // TODO: make sure to check all cases
      const mainRelation = relationType === 'Boardgame' ? type : relationType // swap
      const relationTableName = getTableName(mainRelation) + '_Relation'
      const relationIndex = await findNewUniqueID(relationTableName, 'id')
      const insertObject = {
        id: relationIndex,
        [getVarPrefix(relationType) + '_ID']: relation.id,
        [getVarPrefix(type) + '_ID']: index,
      }
      console.log(insertObject)
      const {data, error} = await from(relationTableName)
        .insert([insertObject], {
          returning: "minimal"
        })
      console.log('result: ', data, error)
      if(error) throw error
    }
  }

  // if(submissionType === 'new') {
  //   console.log('adding a new entry to database relation')
  //   const IDColumn = 'id'
  //   const index = await findNewUniqueID(type, IDColumn)
    
  //   let {data: newData, error: newError} = await from(getTableName(type))
  //     .insert([{
  //       ...JSON.parse(JSONstring),
  //       id: index
  //     }], {
  //       returning: "minimal"
  //     })
  //   console.log(newError, index)
  //   if(newError) throw newError
  //   return {status: 'new entry created'}
  // }

  // // this is where things get complicated ....
  // if(submissionType === 'edit') {
  //   let {data: editData, error: editError} = await from(getTableName(type))
  //     .upsert([JSON.parse(JSONstring)], {
  //       returning: "minimal"
  //     })

  //     return {status: 'entry updated'}
  // }
  
}

// supabase doesn't have autoincrement :(
// so we need to first find the next available id
// either [PREFIX_ID] for regular table, or [id] for relational table

async function findNewUniqueID(type: string, column: string): Promise<number>{
  let {data: idData, error: idError} = await from(getTableName(type))
    .select(column)
  
  if(idError)  throw idError
  let sortedData = idData.map(c=> c[column]).sort((a,b)=> a-b)
  let index = 1
  const max = sortedData.length
  let found = false
  while(!found && index <= max) {
    if(index < sortedData[index - 1])
      found = true
    else
      index++
  }
  console.log('id Data - after', sortedData, index)
  return index
}