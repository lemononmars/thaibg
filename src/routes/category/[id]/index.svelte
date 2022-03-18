<script lang="ts" context="module">
    export async function load({ params, fetch }) {
        // ignore page's [slug] and redirect to the proper location
        const res = await fetch(`/api/category/${params.id}`)
        if(!res.ok)
            return {
                redirect: "/category",
                status: 303
            }
        const data = await res.json()
    
        return {
            redirect: `/category/${params.id}/${data.Cat_slug}`,
            status: 303
        }
    }
</script>