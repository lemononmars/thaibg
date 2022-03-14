<script lang=ts context=module>
    export async function load({fetch}){
      const res = await fetch('/api/investor')
      const data = await res.json()
      return {
         props:{
            investors: data
         }
      }
    }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PlainCard from '$lib/components/PlainCard.svelte'
   
   export let investors
</script>

<Seo title="Investor"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search investor" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each investors as object}
         <PlainCard {object} type="investor"/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>