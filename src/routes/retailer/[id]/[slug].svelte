<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Retailer').select('*').eq('Retailer_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               retailerData: data[0] || null
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   // import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'

   export let user, retailerData
   let boardgameData
   onMount(async ()=>{
      // const {data, error} = await from('Boardgame')
      //    .select('*, Retailer_Relation!inner(*)')
      //    .eq('Retailer_Relation.Retailer_ID', retailerData.Retailer_ID)
         
      // if(error) throw error
      // boardgameData = data

      retailerData.Retailer_picture = DIR_IMAGE + '/retailer/' + (retailerData.Retailer_picture || URL_BLANK_IMAGE)
   })
   
</script>

<Seo title="Retailer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !retailerData}
         Invalid Retailer ID!
      {:else}
         <!-- {#if boardgameData} -->
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{retailerData.Retailer_picture}" alt="image of {retailerData.Retailer_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{retailerData.Retailer_name}</h1>
                  <h2>{retailerData.Retailer_name_th? "(" + retailerData.Retailer_name_th + ")": ""}</h2>
                  <ul>
                     <li>Location: {retailerData.Retailer_location || 'N/A'}</li>
                     <li>Official link: 
                        {#if retailerData.Retailer_link}
                           <a href="{retailerData.Retailer_link}" target="_blank">{retailerData.Retailer_link}</a>
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
               <p>{@html retailerData.Retailer_description || 'N/A'}</p>
            </div>
            <div class="divider"></div>
            <!-- <h2>Board games available</h2> -->
            <!-- <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
               {#each boardgameData as bg}
                  <BoardgameCard {...bg}/>
               {:else}
                  N/A
               {/each}
            </div> -->
         <!-- {:else}
            <Spinner/>
         {/if} -->
      {/if}
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>