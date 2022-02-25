<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const {data, error} = await from('Influencer').select('*').eq('Influencer_ID', params.id)
        if(error || !data[0] || !data[0].Influencer_show)
            return {
                redirect: "/contentcreator",
                status: 303
            }
        else
            return {
                redirect: `/contentcreator/${params.id}/${data[0].Influencer_slug}`,
                status: 303
            }
    }
</script>