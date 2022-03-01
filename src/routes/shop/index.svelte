<script context=module>
   import {from} from '$lib/supabase'

   export async function getShops() {
      let {data, error} = await from('Shop').select('*')
      if(error) throw(error)

      let shops = data.map((s)=>({
         id: s.Shop_ID,
         name: s.Shop_name,
         slug: s.Shop_slug,
         picture: s.Shop_picture,
         type: 'shop'
      }))

      return shops
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PlainCard from '$lib/components/PlainCard.svelte'
   
   let promise = getShops()
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
      {#await promise}
         <Spinner/>
      {:then shops}
         {#each shops as object}
            <PlainCard {object}/>
         {:else}
            No shop
         {/each}
      {/await}
   </div>
</div>