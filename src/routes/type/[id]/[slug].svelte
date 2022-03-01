<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Type').select('*').eq('Type_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               typeData: data[0] || null
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

   export let user, typeData
   let boardgameData
   onMount(async ()=>{
      const {data, error} = await from('Boardgame')
         .select('*, Type_Relation!inner(*)')
         .eq('Type_Relation.Type_ID', typeData.Type_ID)
         
      if(error) throw error
      boardgameData = data
      typeData.Type_picture =  '/type/' + (typeData.Type_picture )
   })
   
</script>

<Seo title="Type"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !typeData}
         Invalid Type ID!
      {:else}
         {#if boardgameData}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{typeData.Type_picture}" alt="image of {typeData.Type_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{typeData.Type_name}</h1>
                  <h2>{typeData.Type_name_th? "(" + typeData.Type_name_th + ")": ""}</h2>
                  <ul>
                     <li>Official link: 
                        {#if typeData.Type_link}
                           <a href="{typeData.Type_link}" target="_blank">{typeData.Type_link}</a>
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
               <p>{@html typeData.Type_description || 'N/A'}</p>
            </div>
            <div class="divider"></div>
            <h2>Board games of this type</h2>
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