<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import ListCard from '$lib/components/ListCard.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let categories = []
   onMount(async () => {
      let {data, error} = await from('Category').select('*')
      categories = data.map((c)=>({
         id: c.Cat_ID,
         name: c.Cat_name,
         slug: c.Cat_slug,
         picture: DIR_IMAGE + '/category/' + (c.Cat_picture || URL_BLANK_IMAGE),
         type: 'category'
      }))

      if(error) throw(error)
   })
   
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
      {#each categories as ds}
         <ListCard {...ds}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>