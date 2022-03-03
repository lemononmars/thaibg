<script context=module>
   import {from} from '$lib/supabase' 

   export async function load({url}) {
      let {data, error} = await from('Person').select('*')

      if(error) 
         return {status: 404}
      return {
         props: {
            people: data,
            role: url.searchParams.get('role'),
            search: url.searchParams.get('name')
         }
      }
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {SearchIcon, ChevronDownIcon, ChevronUpIcon} from 'svelte-feather-icons'
   import DataView from '$lib/components/DataView.svelte'
   import {fly} from 'svelte/transition'
   import { quintOut } from 'svelte/easing';
   import { _ } from 'svelte-i18n'
   

   export let people, search
   export let role // null, Designer, Artist, Graphicdesigner, Creator
   const personRoles = ['All', 'Designer', 'Artist', 'Graphicdesigner','Creator']
   
   let option
   // initialize option (0,1,2,3,4)
   if(!role || personRoles.indexOf(role) == -1)
      option = 0
   else
      option = personRoles.indexOf(role)

   // TODO: pagination
   $: peopleFiltered = people.filter((p)=> 
         (option == 0 || !!p[personRoles[option] + '_ID']) // no role, or has ID of that role
            && 
         (p.Person_name?.toLowerCase().includes(searchString.toLowerCase()) // name or name_th contains the string
            || p.Person_name_th?.includes(searchString))
      )

   
   let sorted = 0
   let searchString = search || ''
   $: peopleSorted = peopleFiltered.sort((a,b)=> compare(sorted, a, b))
   function compare(s: number, a, b) {
      if(s == 0) 
         return b.Person_released - a.Person_released
      else 
         return a.Person_released - b.Person_released
   }

   let showAdvancedFilter = false

   function resetSearch(){
      option = 0
      searchString = ""
   }

   const tableInfo = {
      'headers': ['Roles', 'Team'],
      'body': ['Person_ID', 'Person_team']
   }
</script>

<Seo title="People"/>
<div class="flex flex-col justify-center mx-auto">
   <DataView data={peopleSorted} type="person" {tableInfo}>
      <div class="flex flex-row items-center justify-between gap-2">
         <!-- Role search -->
         <div class="btn-group">
            <button class="btn btn-info"> Select role </button>
            {#each personRoles as pr, idx}
               <button class="btn" 
                  class:btn-active={option === idx}
                  on:click={()=>option = idx}>{pr}
               </button>
            {/each}
         </div>
         <!-- Search box -->
         <div class="form-control m-4">
            <div class="relative">
               <input 
                  type="text" 
                  bind:value={searchString} 
                  placeholder="Search name (th/en)" 
                  class="w-full pr-16 input input-primary input-bordered"
               >
               <button class="absolute top-0 right-0 rounded-l-none btn btn-primary">
                  <SearchIcon size=20/>
               </button>
            </div>
         </div> 
        
         <!-- <a href="./boardgame/create">
            <div class="flex-2 btn btn-secondary">Create new page</div>
         </a> -->
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
         
         </div>
      {/if}
   </DataView>

   {#if peopleSorted?.length == 0}
      <div>
         No result for "{searchString}". Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div> your search query.
      </div>
   {/if}
</div>