<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PersonLink from '$lib/components/PersonLink.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let retailers = []
   onMount(async () => {
      let {data, error} = await from('Retailer').select('*').eq('Retailer_show', true)
      retailers = data.map((d)=>({
         id: d.Retailer_ID,
         name: d.Retailer_name,
         slug: d.Retailer_slug,
         picture: DIR_IMAGE + '/retailer/' + (d.Retailer_picture || URL_BLANK_IMAGE),
         type: 'retailer'
      }))

      if(error) throw(error)
   })
   
</script>

<Seo title="Retailer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search Retailer" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each retailers as ds}
         <PersonLink {...ds}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>