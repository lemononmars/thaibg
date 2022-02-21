<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const {data, error} = await from('Category').select('*').eq('Cat_ID', params.id)
        if(error || !data[0])
            return {
                redirect: "/category",
                status: 303
            }
        else
            return {
                redirect: `/category/${params.id}/${data[0].Cat_slug}`,
                status: 303
            }
    }
</script>