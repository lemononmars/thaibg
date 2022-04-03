<script lang=ts>
   import { getVarPrefix, getTableName } from '$lib/supabase';
   import {SearchIcon, DeleteIcon} from 'svelte-feather-icons'
   import Spinner from './Spinner.svelte';

   export let selects = []
   export let type: string

   let searchString: string = ''
   let searchedData
   let isSearching: boolean = false

   async function search(){
      isSearching = true
      const res = await fetch(`/api/${type}?search=${searchString}`)
      if(res.ok) {
         const data = await res.json()
         searchedData = data.map((d)=>({
            id: d[getVarPrefix(type) + '_ID'], 
            name: d[getVarPrefix(type) + '_name']
         }))
         isSearching = false
      }
   }

   function select(data) {
      selects = [...selects, data]
      searchString = ''
      searchedData = null
   }
</script>

<div class="flex flex-col mx-auto">
   <div class="dropdown mb-4">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0">
         <div class="form-control">
            <label class="label text-sm">{getTableName(type)}</label>
            <div class="input-group input-sm">
               <input 
                  type="text" 
                  placeholder="พิมพ์เพื่อค้นหา" 
                  class="input input-bordered w-70" 
                  bind:value={searchString}
                  on:keyup={(e)=>search()}
               >
               <div class="btn">
                  <SearchIcon size=20/>
               </div>
            </div>
         </div>
      </label>
      <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52" 
         class:hidden={searchString.length == 0}
      >
         {#if isSearching}
            <li><p>Searching...</p><Spinner/></li>
         {:else}
            {#if searchedData}
               {#each searchedData as d}
                  <li><div class="btn btn-ghost" on:click={()=>select(d)}>
                     {d.name}
                  </div></li>
               {:else}
                  <li><div class="btn btn-outline btn-error">หาไม่เจอ</div></li>
               {/each}
            {/if}
         {/if}
      </ul>
   </div>
   {#each selects as s}
      <div class="badge hover:badge-error gap-2" on:click={()=>{
         selects.splice(selects.indexOf(s),1)
         selects = selects
      }}>
         {s.name} <DeleteIcon size=20/>
      </div>
   {/each}
</div>