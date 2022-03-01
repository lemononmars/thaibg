<script lang=ts context=module>
   import {from} from '$lib/supabase'

   export async function getContents(){
      let {data, error} = await from('Content').select('*')
      return data
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import ContentCard from '$lib/components/ContentCard.svelte'
   
   let promise = getContents()
</script>

<Seo title="Content"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search Content" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#await promise}
         <Spinner/>
      {:then contents}
         {#each contents as content}
            <ContentCard {content}/>
         {:else}
            No content
         {/each}
      {/await}
   </div>
</div>