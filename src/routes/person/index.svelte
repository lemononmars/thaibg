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
   import {SearchIcon} from 'svelte-feather-icons'
   import PersonCard from '$lib/components/PersonCard.svelte'
   import {flip} from 'svelte/animate' 

   export let people, search
   export let role // null, Designer, Artist, Graphicdesigner, Creator
   const peopleTitle = ['All', 'Designer', 'Artist', 'Graphicdesginer','Creator']

   let searchString = search || ''
   let option
   // initialize option (0,1,2,3,4)
   if(!role || peopleTitle.indexOf(role) == -1)
      option = 0
   else
      option = peopleTitle.indexOf(role)

   // TODO: pagination
   $: peopleFiltered = people.filter((p)=> 
         (option == 0 || !!p[peopleTitle[option] + '_ID']) // no role, or has ID of that role
            && 
         (p.Person_name.toLowerCase().includes(searchString.toLowerCase()) // name or name_th contains the string
            || p.Person_name_th.includes(searchString))
      )

   function resetSearch(){
      option = 0
      searchString = ""
   }
</script>

<Seo title="People"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4 flex flex-row items-center gap-4">
      <div class="btn-group">
         {#each peopleTitle as _,idx}
            <div 
               class="btn" 
               class:btn-outline={idx != option}
               on:click={()=>option = idx}
               >
               {peopleTitle[idx]}
               </div
            >
         {/each}
      </div>

      <div class="relative">
        <input type="text" placeholder="Search name (Thai or English)" class="w-full pr-16 input input-primary input-bordered" bind:value={searchString}> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 

   {#if peopleFiltered && peopleFiltered.length > 0}
      <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
         {#each peopleFiltered as person (person.Person_name)}
            <div animate:flip="{{duration: 200}}">
               <PersonCard {person}/>
            </div>
         {/each}
      </div>
   {:else}
      <div>
         No result. Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div> your search query.
      </div>
   {/if}
</div>