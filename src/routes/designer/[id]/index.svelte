<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const {data, error} = await from('designer').select('*').eq('id', params.id)
        if(error || !data[0])
            return {
                redirect: "/designer",
                status: 303
            }
        else
            return {
                redirect: `/designer/${params.id}/${data[0].slug}`,
                status: 303
            }
    }
</script>