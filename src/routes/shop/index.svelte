<script context=module>
   import {from} from '$lib/supabase'

   export async function getShops() {
      let {data:shops, error} = await from('Shop').select('*')
      if(error) throw(error)
      return shops
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import SearchBar from '$lib/components/SearchBar.svelte'
   import DataView from '$lib/components/DataView.svelte'
   import { onMount } from 'svelte';
   
   let shops
   let loaded = false
   onMount(async ()=>{
      shops = await getShops()
      loaded = true
   }) 

   let searchString = ''
   $: shopFiltered = shops?.filter((e)=> 
         (e.Shop_name?.toLowerCase().includes(searchString.toLowerCase()) // name or name_th contains the string
            || e.Shop_name_th?.includes(searchString))
      )
   const tableInfo = {
      headers: ['Active', 'Province', 'Online', 'Cafe'],
      body: ['Shp_active', 'Shop_province', 'Shop_online','Shop_cafe']
   }
</script>

<Seo title="Shop"/>
<div class="flex flex-col justify-center mx-auto">
   {#if loaded}
      <DataView data={shopFiltered} type='shop' {tableInfo}>
         <SearchBar placeholder="Search store (en/th)" {searchString}/>
      </DataView>
   {/if}
</div>