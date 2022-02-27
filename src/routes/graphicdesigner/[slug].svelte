<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Artist').select('*').eq('Artist_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               artistData: data[0] || null
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'

   export let user, artistData
   let boardgameData
   onMount(async ()=>{
      const {data, error} = await from('Boardgame')
         .select('*, Artist_Relation!inner(*)')
         .eq('Artist_Relation.Artist_ID', artistData.Artist_ID)
         
      if(error) throw error
      boardgameData = data
      artistData.Artist_thumbnail_url = DIR_IMAGE + '/artist/' + (artistData.Artist_thumbnail_url || URL_BLANK_IMAGE)
   })
   
</script>

<Seo title="Artist"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !artistData}
         Invalid artist ID!
      {:else}
         {#if boardgameData}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{artistData.Artist_thumbnail_url}" alt="image of {artistData.Artist_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{artistData.Artist_name}</h1>
                  <h2>{artistData.Artist_name_th? "(" + artistData.Artist_name_th + ")": ""}</h2>
                  <ul>
                     <li>Team: {artistData.Artist_team || 'N/A'}</li>
                     <li>Official link: 
                        {#if artistData.Artist_link}
                           <a href="{artistData.Artist_link}" target="_blank">{artistData.Artist_link}</a>
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
               <p>{@html artistData.Artist_description}</p>
            </div>
            <div class="divider"></div>
            <h2>Past works</h2>
            <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
               {#each boardgameData as bg}
                  <BoardgameCard bg/>
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