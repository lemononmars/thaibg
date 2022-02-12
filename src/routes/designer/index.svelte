<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from, fromBucket} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import DesignerLink from '$lib/components/DesignerLink.svelte'
   
   let designers = []
   onMount(async () => {
      let {data, error} = await from('designer').select('*')
      designers = data
      const urlPrefix = fromBucket('images').getPublicUrl('designer/').publicURL
      designers.forEach((d)=>{
         d.thumbnail_url = urlPrefix + d.slug + ".jpg"
      })
      if(error) {}
   })
   
</script>

<Seo title="Designer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search designer" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each designers as ds}
         <DesignerLink name={ds.name} id={ds.id} thumbnail_url={ds.thumbnail_url}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>