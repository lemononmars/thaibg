<script context=module>
   import {from} from '$lib/supabase' 

   export async function load({url}) {
      let {data, error} = await from('Boardgame').select('TBG_name, TBG_name_th, TBG_released, TBG_picture, TBG_slug, TBG_ID')
   
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
   import {SearchIcon} from 'svelte-feather-icons'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {flip} from 'svelte/animate'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'

   export let boardgames
   export let search, type // from url params
   let publishers = {}
   boardgames.forEach((bg)=>{publishers[bg.TBG_ID] = ''}) // prepare entry for publisher search
   let publisherLoaded = false

   onMount(async()=>{
      let res = await getPublisher(publishers)
      boardgames = boardgames.map((bg)=>(
         {...bg, publisher: res[bg.TBG_ID]}
      ))
      publisherLoaded = true
   })

   const boardgamePublisherTitle = ['All',  'Published', 'Self published', 'Uncredited', 'Unpublished']
   let option
   // initialize option (0,1,2,3)
   if(!type || boardgamePublisherTitle.indexOf(type) == -1)
      option = 0
   else
      option = boardgamePublisherTitle.indexOf(type)

   $: boardgamesFiltered = boardgames.filter((bg)=> 
         (option == 0
            || bg.publisher === boardgamePublisherTitle[option]
         ) // no type, or has ID of that type
            && 
         (searchString === ''
            || !bg.TBG_name || bg.TBG_name.toLowerCase().includes(searchString.toLowerCase() // name or name_th contains the string
            || !bg.TBG_name_th || bg.TBG_name_th.includes(searchString)) 
         )
      )

   let sorted = 0
   let searchString = search || ''
   let sortBtnTextArray = ["None", "Year (ascending)", "Year (descending)"]
   $: sortBtnText = "Sorted by: " + sortBtnTextArray[sorted]

   $: boardgamesSorted = boardgamesFiltered.sort((a,b)=> compare(sorted, a, b))

   function compare(s: number, a, b) {
      if(s == 1) return a.TBG_released - b.TBG_released
      if(s == 2) return b.TBG_released - a.TBG_released
      return true
   }

   function resetSearch(){
      option = 0
      searchString = ""
   }
</script>

<Seo title="Boardgame"/>
<div class="flex flex-col justify-center items-center relative mx-auto">
   {#if publisherLoaded}
      <div class="flex flex-row items-center justify-between">
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

         <div class="form-control m-4">
            <div class="relative">
               <input 
                  type="text" 
                  bind:value={searchString} 
                  placeholder="Search board game" 
                  class="w-full pr-16 input input-primary input-bordered"
               >
               <button class="absolute top-0 right-0 rounded-l-none btn btn-primary">
                  <SearchIcon size=20/>
               </button>
            </div>
         </div> 
         <div class="flex-1 dropdown">
            <div tabindex="0" class="m-1 btn">{sortBtnText}</div> 
            <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
               {#each sortBtnTextArray as s, idx}
                  <li>
                     <a on:click|preventDefault={() => sorted = idx}>{s}</a>
                  </li> 
               {/each}
            </ul>
         </div>
         <a href="./boardgame/create">
            <div class="flex-2 btn btn-secondary">Create new page</div>
         </a>
      </div>
   {:else}
      <div>
         <Spinner/> Loading search bar
      </div>
   {/if}
   {#if boardgamesSorted && boardgamesSorted.length > 0}
      <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
         {#each boardgamesSorted as bg (bg.TBG_ID)}
            <div animate:flip="{{duration: 300}}">
               <BoardgameCard {bg}/>
            </div>
         {/each}
      </div>
   {:else}
      <div>
         No result. Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div> your search query.
      </div>
   {/if}
</div>