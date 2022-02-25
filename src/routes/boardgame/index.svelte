<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'

   let boardgames = []
   let loaded = false
   onMount(async () => {
      let {data, error} = await from('Boardgame').select('*')
      if(error) throw(error)
      boardgames = data
      loaded = true
   })

   let sorted = 0
   let searchString = ""
   let sortBtnTextArray = ["None", "Year (ascending)", "Year (descending)", "Title (A-Z)", "Title (Z-A)", "Title (่ก-ฮ)", "Title (ฮ-ก)"]
   $: sortBtnText = "Sorted by: " + sortBtnTextArray[sorted]
   $: boardgamesFiltered = boardgames.filter((bg)=> 
         bg.TBG_name?.toLowerCase().includes(searchString.toLowerCase())
      )
   $: boardgamesSorted = boardgamesFiltered.sort((a,b)=> compare(sorted, a, b))
   boardgamesSorted = boardgamesSorted

   function compare(s: number, a, b) {
      if(s == 1) return a.TBG_released - b.TBG_released
      if(s == 2) return b.TBG_released - a.TBG_released
      if(s == 3) return a.TBG_name.localeCompare(b.TBG_name, 'en')
      if(s == 4) return b.TBG_name.localeCompare(a.TBG_name, 'en')
      if(s == 5) return a.TBG_name_th?.localeCompare(b.TBG_name_th, 'th')
      if(s == 6) return b.TBG_name_th?.localeCompare(a.TBG_name_th, 'th')
   }
</script>

<Seo title="Boardgame"/>
<div class="flex flex-col justify-center items-center relative mx-auto">
   <div class="flex flex-row items-center justify-between">
      <div class="form-control m-4">
         <div class="relative">
         <input type="text" bind:value={searchString} placeholder="Search board game" class="w-full pr-16 input input-primary input-bordered"> 
         <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
         </div>
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
      <a href="./boardgame/create"><div class="flex-2 btn btn-secondary">Create new page</div></a>
   </div>
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
         {#each boardgamesSorted as bg}
            <BoardgameCard {bg}/>
         {:else}
            {#if !boardgames}
               <div class="w-full justify-center">
                  No board game found
               </div>
            {:else}
               <Spinner/>
            {/if}
         {/each}
      
   </div>
</div>