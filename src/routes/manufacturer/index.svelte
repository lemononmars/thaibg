<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PlainCard from '$lib/components/PlainCard.svelte'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   
   let manufacturers = []
   onMount(async () => {
      let {data, error} = await from('Manufacturer').select('*')
      manufacturers = data.map((d)=>({
         id: d.Manufacturer_ID,
         name: d.Manufacturer_name,
         slug: d.Manufacturer_slug,
         picture:  '/Manufacturer/' + (d.Manufacturer_picture ),
         type: 'manufacturer'
      }))

      if(error) throw(error)
   })
   
</script>

<Seo title="Manufacturer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search Manufacturer" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each manufacturers as object}
         <PlainCard {object}/>
      {:else}
         {#if manufacturers}
            No Manufacturer found.
         {:else}
            <Spinner/>
         {/if}
      {/each}
   </div>
</div>