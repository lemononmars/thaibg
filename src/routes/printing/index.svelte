<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PersonCard from '$lib/components/PersonCard.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let printings = []
   onMount(async () => {
      let {data, error} = await from('Printing').select('*').eq('Printing_show', true)
      printings = data.map((d)=>({
         id: d.Printing_ID,
         name: d.Printing_name,
         slug: d.Printing_slug,
         picture: DIR_IMAGE + '/printing/' + (d.Printing_picture || URL_BLANK_IMAGE),
         type: 'printing'
      }))

      if(error) throw(error)
   })
   
</script>

<Seo title="Printing"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search Printing" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each printings as ds}
         <PersonCard {...ds}/>
      {:else}
         {#if printings}
            No printing found.
         {:else}
            <Spinner/>
         {/if}
      {/each}
   </div>
</div>