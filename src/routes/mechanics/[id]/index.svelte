<script lang="ts" context="module">
    export async function load({ params, fetch }) {
        // ignore page's [slug] and redirect to the proper location
        const res = await fetch(`/api/mechanics/${params.id}`)
        if(!res.ok)
            return {
                redirect: "/mechanics",
                status: 303
            }

        const data = await res.json()
        return {
            redirect: `/mechanics/${params.id}/${data.Mech_slug}`,
            status: 303
            }
    }
</script>