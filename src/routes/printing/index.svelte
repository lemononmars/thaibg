<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PersonLink from '$lib/components/PersonLink.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let designers = []
   onMount(async () => {
      let {data, error} = await from('Designer').select('*').eq('Designer_show', true)
      designers = data.map((d)=>({
         id: d.Designer_ID,
         name: d.Designer_name,
         slug: d.Designer_slug,
         thumbnail_url: DIR_IMAGE + '/designer/' + (d.Designer_thumbnail_url || URL_BLANK_IMAGE)
      }))

      if(error) throw(error)
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
         <PersonLink {...ds}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>