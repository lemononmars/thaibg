<script context=module>
   import {from} from '$lib/supabase'

   export async function load({}) {
      let {data, error} = await from('Honor').select('*')
      
      if(error) 
         return {
            status: 404
         }

      let honors =  data.map((h)=>({
         id: h.Honor_ID,
         type: 'honor',
         picture: h.Honor_picture,
         slug: h.Honor_slug,
         name: h.Honor_name
      }))
         return {
            props: {
               honors
            }
         }
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PlainCard from '$lib/components/PlainCard.svelte'
   import Spinner from '$lib/components/Spinner.svelte'

   export let honors
</script>

<Seo title="Honor"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search designer" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each honors as object}
         <PlainCard {object}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>