<script context=module>
   import {from} from '$lib/supabase' 

   export async function load() {
      let {data, error} = await from('Person').select('*')
      if(error) 
         return {status: 404}
      return {
         props: {
            people: data
         }
      }
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PersonCard from '$lib/components/PersonCard.svelte'
    
   export let people
   let sorted = 0
   let searchString = ""
   let sortBtnTextArray = ["None", "Title (A-Z)", "Title (Z-A)", "Title (่ก-ฮ)", "Title (ฮ-ก)"]
   $: sortBtnText = "Sorted by: " + sortBtnTextArray[sorted]
   $: peopleFiltered = people.filter((p)=> 
         p.Person_name?.toLowerCase().includes(searchString.toLowerCase())
      )
   $: peopleSorted = peopleFiltered.sort((a,b)=> compare(sorted, a, b))

   function compare(s: number, a, b) {
      if(s == 1) return a.Person_name.localeCompare(b.Person_name, 'en')
      if(s == 2) return b.Person_name.localeCompare(a.Person_name, 'en')
      if(s == 3) return a.Person_name_th?.localeCompare(b.Person_name_th, 'th')
      if(s == 4) return b.Person_name_th?.localeCompare(a.Person_name_th, 'th')
   }
   
</script>

<Seo title="People"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4 flex flex-row items-center">
      <div class="relative">
        <input type="text" placeholder="Search person" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
      <div class="flex-1 dropdown">
         <div tabindex="0" class="m-1 btn">{sortBtnText}</div> 
         <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
            {#each sortBtnTextArray as s, idx}
               <li>
                  <a on:click|preventDefault={() => sorted = idx} href=null>{s}</a>
               </li> 
            {/each}
         </ul>
      </div>
   </div> 

   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each peopleSorted as person}
         <PersonCard {person}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>