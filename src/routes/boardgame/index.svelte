<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import BoardgameLink from '$lib/components/BoardgameLink.svelte'
   import {DIR_IMAGE, URL_BLANK_BG_IMAGE} from '$lib/constants'

   let boardgames = []
   let loaded = false
   onMount(async () => {
      let {data, error} = await from('Boardgame').select('*')
      boardgames = data.map((d)=> ({
         id: d.TBG_ID,
         slug: d.TBG_slug,
         picture: DIR_IMAGE + '/boardgame/' + (d.TBG_picture || URL_BLANK_BG_IMAGE),
         name: d.TBG_name,
         name_th: d.TBG_name_th,
         release: d.TBG_released
      }))
      loaded = true
      console.log(boardgames[0])
      if(error) throw(error)
   })

   let sorted = 0
   let searchString = ""
   let sortBtnTextArray = ["None", "Year (ascending)", "Year (descending)", "Title (A-Z)", "Title (Z-A)", "Title (่ก-ฮ)", "Title (ฮ-ก)"]
   $: sortBtnText = "Sorted by: " + sortBtnTextArray[sorted]
   $: boardgamesFiltered = boardgames.filter((bg)=> 
         bg.name?.toLowerCase().includes(searchString.toLowerCase())
      )
   $: boardgamesSorted = boardgamesFiltered.sort((a,b)=> compare(sorted, a, b))
   function compare(s: number, a, b) {
      if(s == 1) return a.release - b.release
      if(s == 2) return b.release - a.release
      if(s == 3) return a.name.localeCompare(b.name, 'en')
      if(s == 4) return b.name.localeCompare(a.name, 'en')
      if(s == 5) return a.name_th?.localeCompare(b.name_th, 'th')
      if(s == 6) return b.name_th?.localeCompare(a.name_th, 'th')
   }
</script>

<Seo title="Boardgame"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="flex flex-row items-center">
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
                  <a on:click={() => sorted = idx}>{s}</a>
               </li> 
            {/each}
         </ul>
      </div>
   </div>
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-0 lg:gap-4">
      {#each boardgamesSorted as bg}
         <BoardgameLink {...bg}/>
      {:else}
         <div class="w-full justify-center">
            {#if loaded}
               No board game found
            {:else}
               <Spinner/>
            {/if}
         </div>
      {/each}
   </div>
</div>