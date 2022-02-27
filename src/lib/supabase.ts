import { createClient } from '@supabase/supabase-js'

type SupaTable = 'profiles' | 'Artist' | 'Artist_Relation' | 'Honor' | 'Honor_Relation' | 'Boardgame' | 'Category' | 'Category_Relation' | 'Comment' | 'Content' | 'Creator' | 'Creator_Relation' | 'Designer' | 'Designer_Relation' | 'Event' | 'Event_Relation' | 'Graphicdesigner' | 'Graphicdesigner_Relation' | 'Mechanics' | 'Mechanics_Relation' | 'Manufacturer' | 'Manufacturer_Relation' | 
'Person' | 'Place' | 'Place_Relation' | 'Publisher' | 'Publisher_Relation' | 'Retailer' | 'Sponsor' | 'Sponsor_Relation' | 'Type' | 'Type_Relation' 
type SupaStorageBucket = 'avatars' | 'images'


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
export const from = (table: SupaTable) => supabaseClient.from(table)
/**
 *
 * @param bucket The Supabase storage bucket to act upon
 * @returns
 */
export const fromBucket = (bucket: SupaStorageBucket) => supabaseClient.storage.from(bucket)
