<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const {data, error} = await from('Shop').select('*').eq('Shop_ID', params.id)
        if(error || !data[0])
            return {
                redirect: "/shop",
                status: 303
            }
        else
            return {
                redirect: `/shop/${params.id}/${data[0].Shop_slug || 'blank'}`,
                status: 303
            }
    }
</script>