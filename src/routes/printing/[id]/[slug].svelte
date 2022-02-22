<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Printing').select('*').eq('Printing_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               printingData: data[0] || null
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import BoardgameLink from '$lib/components/BoardgameLink.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'

   export let user, printingData
   let boardgameData
   onMount(async ()=>{
      const {data, error} = await from('Boardgame')
         .select('*, Printing_Relation!inner(*)')
         .eq('Printing_Relation.Printing_ID', printingData.Printing_ID)
         
      if(error) throw error
      boardgameData = data
      printingData.Printing_thumbnail_url = DIR_IMAGE + '/printing/' + (printingData.Printing_thumbnail_url || URL_BLANK_IMAGE)
   })
   
</script>

<Seo title="Printing"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !printingData}
         Invalid Printing ID!
      {:else}
         {#if boardgameData && boardgameData.length > 0}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{printingData.Printing_thumbnail_url}" alt="image of {printingData.Printing_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{printingData.Printing_name}</h1>
                  <h2>{printingData.Printing_name_th? "(" + printingData.Printing_name_th + ")": ""}</h2>
                  <ul>
                     <li>Location: {printingData.Printing_location || 'N/A'}</li>
                     <li>Official link: 
                        {#if printingData.Printing_link}
                           <a href="{printingData.Printing_link}" target="_blank">{printingData.Printing_link}</a>
                        {:else}
                           N/A
                        {/if}
                     </li>
                  </ul>
               </div>
            </div>
            <!-- <div>{likes.length}</div> -->
            <div>
               <h2>Description</h2>
               <p>{@html printingData.Printing_description}</p>
            </div>
            <div class="divider"></div>
            <h2>Past works</h2>
            <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
               {#each boardgameData as bg}
                  <BoardgameLink {bg}/>
               {:else}
                  N/A
               {/each}
            </div>
         {:else}
            <Spinner/>
         {/if}
      {/if}
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>