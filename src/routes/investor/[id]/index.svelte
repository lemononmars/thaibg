<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const res = await fetch(`/api/investor/${params.id}`)
        const data = await res.json()
        if(!res.ok || !data.Investor_show)
            return {
                redirect: "/investor",
                status: 303
            }

        return {
            redirect: `/investor/${params.id}/${data[0].slug}`,
            status: 303
        }
</script>