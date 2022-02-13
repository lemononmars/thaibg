<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('designer').select('*').eq('id', params.id)
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
   import {DIR_IMAGE, URL_BLANK_BG_IMAGE, URL_BLANK_DESIGNER_IMAGE} from '$lib/constants'

   export let user, designerData
   let boardgameData
   onMount(async ()=>{
      const {data, error} = await from('boardgame')
         .select('*, boardgame_designer_relation!inner(*)')
         .eq('boardgame_designer_relation.designer', designerData.name)
         
      if(error) throw error
      boardgameData = data.map((d)=> ({
         id: d.id,
         slug: d.slug,
         thumbnail_url: DIR_IMAGE + '/boardgame/' + (d.thumbnail_url || URL_BLANK_BG_IMAGE),
         title: d.title,
         release: d.release
      }))

      designerData.thumbnail_url = DIR_IMAGE + '/designer/' + (designerData.thumbnail_url || URL_BLANK_DESIGNER_IMAGE)
   })
   
</script>

<Seo title="Designer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !designerData}
         Invalid designer ID!
      {:else}
         {#if boardgameData}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{designerData.thumbnail_url}" alt="image of {designerData.name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{designerData.name}</h1>
                  <h2>{designerData.thainame? "(" + designerData.thainame + ")": ""}</h2>
               </div>
            </div>
            <div>
               <h2>Bio</h2>
               <p>{@html designerData.bio}</p>
            </div>
            <div class="divider"></div>
            <h2>Past works</h2>
            <div class="w-full text-center mb-4 flex flex-row justify-left items-center gap-4">
               {#each boardgameData as bg}
                  <BoardgameLink {...bg}/>
               {:else}
                  N/A
               {/each}
            </div>
            <div class="divider"></div>
            <h2>Contact</h2>
               {#if designerData.email}
               <div>e-mail: {designerData.email}</div>
               {/if}
               {#if designerData.website}
               <div>website: {designerData.website}</div>
               {/if}
            
         {:else}
            <Spinner/>
         {/if}
      {/if}
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>