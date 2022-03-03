<script context=module>
   import {from} from '$lib/supabase'

   export async function getHonor() {
      let {data:honors, error} = await from('Honor').select('*')
      if(error) throw(error)
      return honors
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import SearchBar from '$lib/components/SearchBar.svelte'
   import DataView from '$lib/components/DataView.svelte'
   import { onMount } from 'svelte';
   
   let honors
   let loaded = false
   onMount(async ()=>{
      honors = await getHonor()
      loaded = true
   }) 

   let searchString = ''
   $: honorFiltered = honors?.filter((e)=> 
         (e.Honor_name?.toLowerCase().includes(searchString.toLowerCase()) // name or name_th contains the string
            || e.Honor_name_th?.includes(searchString))
      )
   const tableInfo = {
      headers: ['Type'],
      body: ['Honor_type']
   }
</script>

<Seo title="Shop"/>
<div class="flex flex-col justify-center mx-auto">
   {#if loaded}
      <DataView data={honorFiltered} type='honor' {tableInfo}>
         <SearchBar placeholder="Search honor (en/th)" {searchString}/>
      </DataView>
   {/if}
</div>