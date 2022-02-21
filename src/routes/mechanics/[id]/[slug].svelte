<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Designer').select('*').eq('Designer_ID', params.id)
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
      const {data, error} = await from('Boardgame')
         .select('*, Designer_Relation!inner(*)')
         .eq('Designer_Relation.Designer_ID', designerData.Designer_ID)
         
      if(error) throw error
      boardgameData = data.map((bg)=> ({
         id: bg.TBG_ID,
         slug: bg.TBG_slug,
         thumbnail_url: DIR_IMAGE + '/boardgame/' + (bg.TBG_thumbnail_url || URL_BLANK_BG_IMAGE),
         name: bg.TBG_name,
         release: bg.TBG_released
      }))

      designerData.Designer_thumbnail_url = DIR_IMAGE + '/designer/' + (designerData.Designer_thumbnail_url || URL_BLANK_DESIGNER_IMAGE)
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
               <img src="{designerData.Designer_thumbnail_url}" alt="image of {designerData.Designer_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{designerData.Designer_name}</h1>
                  <h2>{designerData.Designer_name_th? "(" + designerData.Designer_name_th + ")": ""}</h2>
                  <ul>
                     <li>Team: {designerData.Designer_team || 'N/A'}</li>
                     <li>Official link: 
                        {#if designerData.Designer_link}
                           <a href="{designerData.Designer_link}" target="_blank">{designerData.Designer_link}</a>
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
               <p>{@html designerData.Designer_description}</p>
            </div>
            <div class="divider"></div>
            <h2>Past works</h2>
            <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
               {#each boardgameData as bg}
                  <BoardgameLink {...bg}/>
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