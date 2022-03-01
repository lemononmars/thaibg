<script lang=ts context=module>
   export async function getCategories(){
      let {data, error} = await from('Category').select('*')
      
      let categories = data.map((c)=>({
         id: c.Cat_ID,
         name: c.Cat_name,
         slug: c.Cat_slug,
         picture: c.Cat_picture,
         type: 'category'
      }))

      return categories
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import ListCard from '$lib/components/ListCard.svelte'
   
   let promise = getCategories()
</script>

<Seo title="Category"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search category" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 lg:gap-4">
      {#await promise}
         <Spinner/>
      {:then categories}
         {#each categories as ds}
            <ListCard {...ds}/>
         {:else}
            None
         {/each}
      {/await}
   </div>
</div>