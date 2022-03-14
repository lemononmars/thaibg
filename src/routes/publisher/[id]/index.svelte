<script lang="ts" context="module">
    export async function load({ params, fetch }) {
        // ignore page's [slug] and redirect to the proper location
        const res = await fetch(`/api/publisher/${params.id}`)
        const data = await res.json()
        if(!res.ok || data.Publisher_show)
            return {
                redirect: "/publisher",
                status: 303
            }
        else
            return {
                redirect: `/publisher/${params.id}/${data.Publisher_slug}`,
                status: 303
            }
    }
</script>