<script lang="ts" context="module">

    export async function load({ params, fetch }) {
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
    }
</script>