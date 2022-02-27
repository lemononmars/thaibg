<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ params }) {
       // ignore page's [slug] and redirect to the proper location
       const {data, error} = await from('Honor').select('*').eq('Honor_ID', params.id)
       if(error || !data[0] || !data[0].Honor_show)
           return {
               redirect: "/honor",
               status: 303
           }
       else
           return {
               redirect: `/honor/${params.id}/${data[0].Honor_slug}`,
               status: 303
           }
   }
</script>