<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Mechanics').select('*').eq('Mech_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               mechanicsData: data[0] || null
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

   export let user, mechanicsData
   let boardgameData
   onMount(async ()=>{
      const {data, error} = await from('Boardgame')
         .select('*, Mechanics_Relation!inner(*)')
         .eq('Mechanics_Relation.Mech_ID', mechanicsData.Mech_ID)
         
      if(error) throw error
      boardgameData = data
      mechanicsData.Mech_picture = DIR_IMAGE + '/mechanics/' + (mechanicsData.Mech_picture || URL_BLANK_IMAGE)
   })
   
</script>

<Seo title="Mechanics"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !mechanicsData}
         Invalid mechanics ID!
      {:else}
         {#if boardgameData}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{mechanicsData.Mech_picture}" alt="image of {mechanicsData.Mech_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{mechanicsData.Mech_name}</h1>
                  <h2>{mechanicsData.Mech_name_th? "(" + mechanicsData.Mech_name_th + ")": ""}</h2>
                  <ul>
                     <li>
                        {#if mechanicsData.Mech_link}
                           <a href="{mechanicsData.Mech_link}" target="_blank">{mechanicsData.Mech_link}</a>
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
               <p>{@html mechanicsData.Mech_description || 'n/A'}</p>
            </div>
            <div class="divider"></div>
            <h2>Board games with this mechanics</h2>
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