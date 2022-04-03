import { createClient } from '@supabase/supabase-js'

type SupaTable = 'profiles' | 'Artist' | 'Artist_Relation' | 'Honor' | 'Honor_Relation' | 'Boardgame' | 'Category' | 'Category_Relation' | 'Comment' | 'Content' | 'Creator' | 'Creator_Relation' | 'Designer' | 'Designer_Relation' | 'Event' | 'Event_Relation' | 'Graphicdesigner' | 'Graphicdesigner_Relation' | 'Mechanics' | 'Mechanics_Relation' | 'Manufacturer' | 'Manufacturer_Relation' | 
'Person' | 'Place' | 'Place_Relation' | 'Playtester' | 'Playtester_Relation' | 'Publisher' | 'Publisher_Relation' | 'Shop' | 'Shop_Relation' | 'investor' | 'Investor_Relation' | 'Type' | 'Type_Relation' 
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
// TO BE FIXED: forced type table: SupaTable
export const from = (table) => supabaseClient.from(table)
/**
 *
 * @param bucket The Supabase storage bucket to act upon
 * @returns
 */
export const fromBucket = (bucket: SupaStorageBucket) => supabaseClient.storage.from(bucket)

export function getTableName (type: string){
  return type[0].toUpperCase() + type.slice(1)
}

/**
 * Return the conresponding prefix to be used with database
 * @param {String} type type of object (e.g. boardgame, person, mechanics)
 * @returns {String} (e.g. TBG, Person, Mech)
 */
export function getVarPrefix (type: string){
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
export function getImageURL (type: string, url: string) {
  return DIR_IMAGE + `${type}/` + (url || DEFAULT_IMAGE_FILE)
}

/**
 * Load image from a public folder in images/
 * @param {String} type
 * @returns {String}
 */
export function getDefaultImageURL (type: string) {
  return DIR_IMAGE + `${type}/` + DEFAULT_IMAGE_FILE
}


type SubmissionType = 'create' | 'edit' | 'report'
interface submissionData {
  type: SubmissionType,
  content,
  pageType: string,
  id: string,
  username: string,
  comment: string
}
export async function addToSubmission (data: submissionData){
  // very bad practice? 
  // better with post?
  const {data: res, error} = await from('Submission')
    .insert([{
      Submission_type: data.type, 
      Submission_content: JSON.stringify(data.content), 
      Submission_page_type: data.pageType,
      Submission_user_ID: encodeURI(data.id),
      Submission_username: encodeURI(data.username),
      Submission_date: new Date(),
      Submission_status: 'pending',
      Submission_comment: data.comment
    }])
   if(error)
      return {status: error.message}
   return {status: 'success'}
}

export async function changeSubmissionStatus(id, approved:string){
  const{data, error} = await from('Submission')
    .upsert([{
      id,
      Submission_status: approved
    }])
  if(error)
    return {status: error.message}
  
  if(approved === 'approved') {
    const {data, error} = await from('Submission')
      .select('Submission_content, Submission_page_type')
      .eq('id', id)
      .single()
    if(error)
      return {status: error.message}

    addToDatabase(data.Submission_content, data.Submission_page_type)
  }
  return {status: 'status changed successfully'}
  // then, add to table if approved
}

export async function addToDatabase (JSONvalue, type) {
  // should strip on submitted user id and stuff
  console.log('about to add to ', type)
  const {data, error} = await from(type)
    .upsert([JSON.parse(JSONvalue)])
  if(error) {
      throw(error)
 }
 console.log('successfully added!')
  return data
}