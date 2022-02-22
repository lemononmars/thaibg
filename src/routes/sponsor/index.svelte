<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PersonLink from '$lib/components/PersonLink.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let sponsors = []
   onMount(async () => {
      let {data, error} = await from('Sponsor').select('*').eq('Sponsor_show', true)
      sponsors = data.map((d)=>({
         id: d.Sponsor_ID,
         name: d.Sponsor_name,
         slug: d.Sponsor_slug,
         picture: DIR_IMAGE + '/sponsor/' + (d.Sponsor_picture || URL_BLANK_IMAGE),
         type: 'sponsor'
      }))

      if(error) throw(error)
   })
   
</script>

<Seo title="Sponsor"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search Sponsor" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each sponsors as s}
         <PersonLink {...s}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>