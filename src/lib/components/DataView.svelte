<script lang="ts">
   import {getImageURL, getDefaultImageURL, getVarPrefix} from '$lib/supabase' 

   import SearchNavigation from "./SearchNavigation.svelte";
   import {GridIcon, ListIcon} from 'svelte-feather-icons'
   import PersonCard from '$lib/components/PersonCard.svelte'
   import BoardgameCard from "$lib/components/BoardgameCard.svelte";
   import PlainCard from "$lib/components/PlainCard.svelte";
   import EventCard from "$lib/components/EventCard.svelte";
   import ContentCard from "$lib/components/ContentCard.svelte"
   import ListCard from "$lib/components/ListCard.svelte";
   import {flip} from 'svelte/animate'
   import { _ } from 'svelte-i18n'

   type dataType = 'boardgame' | 'person' | 'manufacturer' | 'shop' | 'publisher' | 'content' | 'event' | 'honor'
   export let data, type: dataType, tableInfo
   const typePrefix = getVarPrefix(type)

   let listView = 'list'

   // pagination
   const ENTRY_PER_PAGES = 20
   $: numData = data.length
   $: numPages = Math.ceil(numData/ENTRY_PER_PAGES)
   let activePage = 0
   $: dataCurrentPage = data.slice(activePage * ENTRY_PER_PAGES, (activePage + 1) * ENTRY_PER_PAGES)

   function changePage(page: number){
      activePage = page
      window.scroll({top: 0, behavior: 'smooth'})
   }
</script>

<div class="flex flex-col justify-center items-center relative mx-auto">
   <!-- search bar, customized for each page-->
   <SearchNavigation/>
   <slot></slot>
    <div class="flex flex-row items-center ">
       <!-- Select table view or grid view -->
      <div class="btn-group">
         <div class="btn" 
            on:click={()=>listView = 'list'} 
            class:btn-active={listView === 'list'}>
            <div class="tooltip" data-tip="List view">
               <ListIcon size="20"/>
            </div>
         </div>
         <div class="btn" 
            on:click={()=>listView = 'grid'} 
            class:btn-active={listView === 'grid'}>
            <div class="tooltip" data-tip="Grid view">
               <GridIcon size="20"/>
            </div>
         </div>
      </div>
      <!-- top pagination -->
      <div class="m-2">
         <div class="btn-group">
            <button class="btn">Page </button>
            {#each Array(numPages) as _, idx}
               <button class="btn" 
                  class:btn-active={activePage === idx}
                  on:click={()=>changePage(idx)}>{idx+1}</button>
            {/each}
         </div>
      </div>
   </div>
   {#if dataCurrentPage && data.length > 0}
      {#if listView === 'grid'}
         <!-- Grid view -->
         <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {#each dataCurrentPage as d (d[typePrefix + '_ID']) }
               <div animate:flip="{{duration: 300}}">
                  {#if type === 'person'}
                     <PersonCard person={d}/>
                  {:else if type === 'boardgame'}
                     <BoardgameCard bg={d}/>
                  {:else if type === 'event'}
                     <EventCard event={d}/>
                  {:else if type === 'content'}
                     <ContentCard content={d}/>
                  {:else}
                     <PlainCard object={d} {type}/>
                  {/if}
               </div> 
            {/each}
         </div>
      {:else}
      <!-- Table view -->
         <div class="overflow-x-auto w-full">
            <table class="table table-zebra w-full">
               <thead>
                  <tr>
                     <th>Image</th>
                     <th>Name</th>
                     {#each tableInfo.headers as t}
                        <th>{t}</th>
                     {/each}
                  </tr>
               </thead>
               <!-- Table body -->
               <tbody>
                  {#each dataCurrentPage as d (d[typePrefix + '_ID'])}
                     <tr animate:flip="{{duration: 300}}">
                        <td>
                           <div class="avatar">
                              <div class="h-16 w-16 hover:scale-150 object-contain">
                                 <img src="{getImageURL(type,d[typePrefix + '_picture'])}"
                                    class="aspect-auto" 
                                    alt="thumbnail"
                                    on:error|once={(ev)=>ev.target.src = getDefaultImageURL(type)}
                                 />
                              </div>
                           </div>
                        </td>
                        <td>
                           <a href="/{type}/{d[typePrefix + '_ID']}">
                              <p class="break-words">{d[typePrefix + '_name'] || d[typePrefix + '_name_th'] || 'N/A'}</p>
                              {#if d[typePrefix + '_name'] && d[typePrefix + '_name_th']}
                                 <p class="opacity-60 break-words">{d[typePrefix + '_name_th']}</p>
                              {/if}
                           </a>
                        </td>
                        {#each tableInfo.body as t}
                           <td>
                              {d[t] || '-'}
                           </td>
                        {/each}
                     </tr>
                  {/each}
               </tbody>
            </table>
         </div>
      {/if}
      <!-- bottom pagination -->
      <div class="m-2">
         <div class="btn-group">
            <button class="btn">Page </button>
            {#each Array(numPages) as _, idx}
               <button class="btn" 
                  class:btn-active={activePage === idx}
                  on:click={()=>changePage(idx)}>{idx+1}</button>
            {/each}
         </div>
      </div>
   {:else}
      <div>
         No result found.
      </div>
   {/if}
</div>