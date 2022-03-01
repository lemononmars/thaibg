<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Sponsor').select('*').eq('Sponsor_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               sponsorData: data[0] || null
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export let user, sponsorData
   let boardgameData
   onMount(async ()=>{
      const {data, error} = await from('Boardgame')
         .select('*, Sponsor_Relation!inner(*)')
         .eq('Sponsor_Relation.Sponsor_ID', sponsorData.Sponsor_ID)
         
      if(error) throw error
      boardgameData = data
      sponsorData.Sponsor_thumbnail_url =  '/sponsor/' + (sponsorData.Sponsor_thumbnail_url )
   })
   
</script>

<Seo title="Sponsor"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !sponsorData}
         Invalid Sponsor ID!
      {:else}
         {#if boardgameData}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{sponsorData.Sponsor_thumbnail_url}" alt="image of {sponsorData.Sponsor_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{sponsorData.Sponsor_name}</h1>
                  <h2>{sponsorData.Sponsor_name_th? "(" + sponsorData.Sponsor_name_th + ")": ""}</h2>
                  <ul>
                     <li>Official link: 
                        {#if sponsorData.Sponsor_link}
                           <a href="{sponsorData.Sponsor_link}" target="_blank">{sponsorData.Sponsor_link}</a>
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
               <p>{@html sponsorData.Sponsor_description || 'N/A'}</p>
            </div>
            <div class="divider"></div>
            <h2>Sponsoring</h2>
            <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
               {#each boardgameData as bg}
                  <BoardgameCard {bg}/>
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