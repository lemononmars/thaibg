<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import ListLink from '$lib/components/ListLink.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let events = []
   onMount(async () => {
      let {data, error} = await from('Event').select('*').eq('Event_show', true)
      events = data.map((e)=>({
         id: e.Event_ID,
         name: e.Event_name,
         slug: e.Event_slug,
         picture: DIR_IMAGE + '/event/' + (e.Event_picture || URL_BLANK_IMAGE),
         type: 'event'
      }))

      if(error) throw(error)
   })
   
</script>

<Seo title="Event"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search event" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each events as e}
         <ListLink {...e}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>