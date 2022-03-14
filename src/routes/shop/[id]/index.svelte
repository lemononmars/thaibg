<script lang="ts" context="module">

    export async function load({ params, fetch }) {
        // ignore page's [slug] and redirect to the proper location
        const res = await fetch(`/api/shop/${params.id}`)
        if(!res.ok)
            return {
                redirect: "/shop",
                status: 303
            }

        const data = await res.json()
        return {
            redirect: `/shop/${params.id}/${data.Shop_slug || 'blank'}`,
            status: 303
        }
    }
</script>