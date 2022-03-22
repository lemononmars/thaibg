<script context=module>
   export async function load({fetch}) {
      const res = await fetch('/api/shop')
      if(!res.ok) return {status: 404, message: 'cannot find any shop'}
      const data = await res.json()
      return {
         props:{
            shops: data
         }
      }
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {ChevronDownIcon, ChevronUpIcon} from 'svelte-feather-icons'
   import Searchbar from '$lib/components/SearchBar.svelte'
   import {fly} from 'svelte/transition'
   import { quintOut } from 'svelte/easing';
   import { _ } from 'svelte-i18n'
   import DataView from '$lib/components/DataView.svelte'
   import type {Shop} from '$lib/datatypes'
   
   export let shops
   export let search// from url params

   const optionList = ['all', 'yes', 'no']
   const optionShopSuffix = ['online' , 'physical', 'cafe']
   const optionShopStatus = ['all', 'active' , 'inactive', 'closed']
   let optionSelects: number[] = optionShopSuffix.map(()=>0)
   let optionStatusSelect: number = 0
   
   $: shopsFiltered = shops.filter((s)=> 
         optionShopSuffix.every((sf, idx)=>
            (optionSelects[idx] == 0) 
            || ((optionSelects[idx] == 1) && s['Shop_' + sf])
            || ((optionSelects[idx] == 2) && !s['Shop_' + sf])
         )
            && 
         (
            (optionStatusSelect == 0)
            || (s.Shop_status === optionShopStatus[optionStatusSelect])
         )
            &&
         (searchString === ''
            || s.Shop_name?.toLowerCase().includes(searchString.toLowerCase())
            || s.Shop_name_th?.includes(searchString)
         )
      )

   let sorted = 0
   let searchString = search || ''
   $: shopsSorted = shopsFiltered.sort((a,b)=> compare(sorted, a, b))

   // TODO: allow advanced search settings
   function compare(s: number, a, b) {
      if(s == 0) 
         return b.Shop_name?.localeCompare(a.Shop_name)
      else 
         return a.Shop_name?.localeCompare(b.Shop_name)
   }

   let showAdvancedFilter = false

   function resetSearch(){
      optionSelects = optionShopSuffix.map(()=>0)
      searchString = ""
   }

   const tableInfo = {
      headers: ['Status', 'Province', 'Online', 'Physical', 'Cafe'],
      body: ['Shop_status', 'Shop_province', 'Shop_online', 'Shop_physical', 'Shop_cafe']
   }
</script>

<Seo title="Shop"/>
<div class="flex flex-col justify-center mx-auto">
   <DataView data={shopsSorted} type='shop' {tableInfo}>
      <!-- Search box -->
   <div class="flex flex-row items-center gap-4">
      <Searchbar placeholder="Search shop (en/th)" bind:searchString/>
      <div class="btn gap-2" on:click={()=>showAdvancedFilter = !showAdvancedFilter}>
         Advanced Filter
         {#if showAdvancedFilter}
            <ChevronUpIcon size="1x"/>
         {:else}
            <ChevronDownIcon size="1x"/>
         {/if}
      </div>
   </div>
   <!-- Advanced filter (hidden by default) -->
   {#if showAdvancedFilter}
      <div transition:fly="{{duration:400, y:-20, easing: quintOut}}" class="m-2">
         <div class="flex flex-row items-center gap-2">
            <div class="flex flex-col justify-center">
               <h3>status</h3>
               <div class="btn-group">
                  {#each optionShopStatus as status,idx}
                     <div 
                        class="btn btn-xs" 
                        class:btn-active={idx == optionStatusSelect}
                        on:click={()=>optionStatusSelect = idx}
                        >
                        {status}
                        </div
                     >
                  {/each}
               </div>
            </div>
            {#each optionShopSuffix as sf, sf_idx}
               <div class="flex flex-col justify-center">
                  <h3>{sf}</h3>
                  <div class="btn-group">
                     {#each optionList as list,idx}
                        <div 
                           class="btn btn-xs" 
                           class:btn-active={idx == optionSelects[sf_idx]}
                           on:click={()=>optionSelects[sf_idx] = idx}
                           >
                           {list}
                           </div
                        >
                     {/each}
                  </div>
               </div>
            {/each}
            
         </div>
      </div>
   {/if}
   </DataView>

   {#if shopsSorted?.length == 0}
      <div>
         No result. Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div> your search query.
      </div>
   {/if}
</div>