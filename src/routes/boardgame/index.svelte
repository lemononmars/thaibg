<script context=module>
   import {from, getImageURL, getDefaultImageURL} from '$lib/supabase' 

   export async function load({url}) {
      let {data, error} = await from('Boardgame').select('TBG_name, TBG_name_th, TBG_released, TBG_picture, TBG_slug, TBG_ID, TBG_status')
   
      if(error) 
         return {status: 404}

      return {
         props: {
            boardgames: data,
            type: url.searchParams.get('type'),
            search: url.searchParams.get('name')
         }
      }
   }

   export async function getPublisher(data) {
       // publisher info for search query
       for(let id in data) {
         let {data:publisher, error} = await from ('Publisher')
            .select('*, Publisher_Relation!inner(*)')
            .eq('Publisher_Relation.TBG_ID', id)

         let p = error? 'Uncredited' : publisher[0].Publisher_name
         if(p !== 'Unpublished' && p !== 'Self published' && p!== "Uncredited")
            p = 'Published' // traditional publisher
         data[id] = p
      }
      return data
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
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'

   export let boardgames
   export let search, type // from url params

   const boardgamePublisherTitle = ['All',  'Published', 'Self published', 'Uncredited', 'Unpublished']
   let option
   // initialize option (0,1,2,3)
   if(!type || boardgamePublisherTitle.indexOf(type) == -1)
      option = 0
   else
      option = boardgamePublisherTitle.indexOf(type)

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