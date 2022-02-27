<script lang='ts' context='module'>
import {from} from '$lib/supabase'

export async function load({ params }) {
    // ignore page's [slug] and redirect to the proper location
    const {data, error} = await from('Boardgame').select('TBG_slug').eq('TBG_ID', params.id)
    if(error || !data[0])
        return {
            redirect: "/boardgame",
            status: 303
        }
    else
        return {
            redirect: `/boardgame/${params.id}/${data[0].TBG_slug}`,
            status: 303
        }
}
</script>