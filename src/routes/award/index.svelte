<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import DesignerLink from '$lib/components/PersonLink.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let awards = []
   onMount(async () => {
      let {data, error} = await from('Award').select('*')
      if(error) throw(error)
      awards = data
   })
   
</script>

<Seo title="Award"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search designer" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4">
      <ul>
      {#each awards as a}
         <li>{a.Award_name}</li>
      {:else}
         <Spinner/>
      {/each}
      </ul>
   </div>
</div>