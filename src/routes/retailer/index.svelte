<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PlainCard from '$lib/components/PlainCard.svelte'
   
   let retailers = []
   onMount(async () => {
      let {data, error} = await from('Retailer').select('*').eq('Retailer_show', true)
      retailers = data.map((d)=>({
         id: d.Retailer_ID,
         name: d.Retailer_name,
         slug: d.Retailer_slug,
         picture: d.Retailer_picture,
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
      {#each retailers as object}
         <PlainCard {object}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>