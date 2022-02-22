<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const {data, error} = await from('Sponsor').select('*').eq('Sponsor_ID', params.id)
        if(error || !data[0] || !data[0].Sponsor_show)
            return {
                redirect: "/sponsor",
                status: 303
            }
        else
            return {
                redirect: `/sponsor/${params.id}/${data[0].slug}`,
                status: 303
            }
    }
</script>