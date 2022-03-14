<script lang="ts" context="module">
    export async function load({ params }) {
        // ignore page's [slug] and redirect to the proper location
        const res = await fetch(`/api/content/${params.id}`)
        if(!res.ok)
            return {
                redirect: "/content",
                status: 303
            }

        const data = await res.json()
        return {
            redirect: `/content/${params.id}/${data.Content_slug}`,
            status: 303
        }
    }
</script>