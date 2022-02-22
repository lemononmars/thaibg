<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const {data, error} = await from('Type').select('*').eq('Type_ID', params.id)
        if(error || !data[0] || !data[0].Type_show)
            return {
                redirect: "/type",
                status: 303
            }
        else
            return {
                redirect: `/type/${params.id}/${data[0].slug}`,
                status: 303
            }
    }
</script>