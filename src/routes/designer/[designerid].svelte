<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('designer').select('*').eq('id', params.designerid)
       if(error) {}
       return {
           props: {
               user,
               designerData: data[0] || null
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import BoardgameLink from '$lib/components/BoardgameLink.svelte'

   export let user, designerData
   let boardgameData
   onMount(async ()=>{
      const {data, error} = await from('boardgame')
         .select('*, boardgame_designer_relation!inner(*)')
         .eq('boardgame_designer_relation.designer', designerData.name)
      if(error)
         throw error
      boardgameData = data
      console.log("designer data is", designerData)
      console.log("board game data is", boardgameData)
   })
   
</script>

<Seo title="Designer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-center mb-4 flex flex-col place-items-center">
      {#if !designerData}
         Invalid designer ID!
      {:else}
         {#if boardgameData}
            <div>
               <h1 class="text-3xl">{designerData.name} {designerData.thainame? "(" + designerData.thainame + ")": ""}</h1><br>
               Bio:
               <p>{@html designerData.bio}</p>
               <div class="divider"></div>
               Past works:
               <div class="w-full text-center mb-4 flex flex-row justify-left items-center gap-4">
                  {#each boardgameData as bg}
                    <BoardgameLink id={bg.id} title={bg.title} release={bg.release} thumbnail_url={bg.thumbnail_url}/>
                  {:else}
                     N/A
                  {/each}
               </div>
               <div class="divider"></div>
               Contact:
               {#if designerData.email}
               <div>e-mail: {designerData.email}</div>
               {/if}
               {#if designerData.website}
               <div>website: {designerData.website}</div>
               {/if}
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