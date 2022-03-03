<script context=module>
   import {from} from '$lib/supabase'

   export async function getPublishers() {
      let {data:publishers, error} = await from('Publisher').select('*')
      if(error) throw(error)
      return publishers
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import SearchBar from '$lib/components/SearchBar.svelte'
   import DataView from '$lib/components/DataView.svelte'
   import { onMount } from 'svelte';
   
   let publishers
   let loaded = false
   onMount(async ()=>{
      publishers = await getPublishers()
      loaded = true
   }) 

   let searchString = ''
   $: publisherFiltered = publishers?.filter((p)=> 
         (p.Publisher_name?.toLowerCase().includes(searchString.toLowerCase()) // name or name_th contains the string
            || p.Publisher_name_th?.includes(searchString))
      )
   const tableInfo = {
      headers: [],
      body: []
   }
</script>

<Seo title="Shop"/>
<div class="flex flex-col justify-center mx-auto">
   {#if loaded}
      <DataView data={publisherFiltered} type='publisher' {tableInfo}>
         <SearchBar placeholder="Search publisher (en/th)" {searchString}/>
      </DataView>
   {/if}
</div>