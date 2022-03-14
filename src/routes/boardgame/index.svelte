<script context=module>
   export async function load({url, fetch}) {
      const res = await fetch('/api/boardgame')
      if(!res.ok) return {status: 404}

      const data = await res.json()
      return {
         props: {
            boardgames: data,
            search: url.searchParams.get('name')
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
   import Spinner from '$lib/components/Spinner.svelte'

   export let boardgames
   export let search// from url params

   const boardgamePublisherTitle = ['All',  'Published', 'Self published', 'Uncredited', 'Unpublished']
   let option = 0

   $: boardgamesFiltered = boardgames.filter((bg)=> 
         (option == 0
            || bg.TBG_status === boardgamePublisherTitle[option]
         )
            && 
         (searchString === ''
            || bg.TBG_name?.toLowerCase().includes(searchString.toLowerCase() // name or name_th contains the string
            || bg.TBG_name_th?.includes(searchString)) 
         )
      )

   let sorted = 0
   let searchString = search || ''
   $: boardgamesSorted = boardgamesFiltered.sort((a,b)=> compare(sorted, a, b))
   function compare(s: number, a, b) {
      if(s == 0) 
         return b.TBG_released - a.TBG_released
      else 
         return a.TBG_released - b.TBG_released
   }

   let showAdvancedFilter = false

   function resetSearch(){
      option = 0
      searchString = ""
   }

   const tableInfo = {
      'headers': ['Released', 'Status'],
      'body': ['TBG_released', 'TBG_status']
   }
</script>

<Seo title="Boardgame"/>
<div class="flex flex-col justify-center items-center relative mx-auto">
   <DataView data={boardgamesSorted} type="boardgame" {tableInfo}>
   <!-- Search box -->
   <div class="flex flex-row items-center gap-4">
      <Searchbar placeholder="Search board game (en/th)" bind:searchString/>
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
         <div class="btn-group">
            {#each boardgamePublisherTitle as _,idx}
               <div 
                  class="btn" 
                  class:btn-outline={idx != option}
                  on:click={()=>option = idx}
                  >
                  {boardgamePublisherTitle[idx]}
                  </div
               >
            {/each}
         </div>
      </div>
   {/if}
   </DataView>
   {#if boardgamesSorted?.length == 0}
      <div>
         No result for "{searchString}". Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div> your search query.
      </div>
   {/if}
</div>