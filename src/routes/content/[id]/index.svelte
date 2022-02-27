<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const {data, error} = await from('Content').select('*').eq('Content_ID', params.id)
        if(error || !data[0])
            return {
                redirect: "/content",
                status: 303
            }
        else
            return {
                redirect: `/content/${params.id}/${data[0].Content_slug}`,
                status: 303
            }
    }
</script>