<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import ListLink from '$lib/components/ListLink.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let types = []
   onMount(async () => {
      let {data, error} = await from('Type').select('*')
      types = data.map((t)=>({
         id: t.Type_ID,
         name: t.Type_name,
         slug: t.Type_slug,
         picture: DIR_IMAGE + '/type/' + (t.Type_picture || URL_BLANK_IMAGE),
         type: 'type'
      }))

      if(error) throw(error)
   })
   
</script>

<Seo title="Type"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search Type" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each types as ds}
         <ListLink {...ds}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>