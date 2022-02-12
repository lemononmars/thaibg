<script lang="ts" context="module">
   import {from, fromBucket} from '$lib/supabase'

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
      const urlPrefix = fromBucket('images').getPublicUrl('boardgame/').publicURL
      boardgameData.forEach((bg)=>{
         bg.slug = urlPrefix + bg.slug + ".jpg"
      })

      const designerUrlPrefix = fromBucket('images').getPublicUrl('designer/').publicURL
      designerData.slug = designerUrlPrefix + designerData.slug + ".jpg"
   })
   
</script>

<Seo title="Designer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !designerData}
         Invalid designer ID!
      {:else}
         {#if boardgameData}
            <div class="flex flex-col lg:flex-row gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{designerData.slug}" alt="image of {designerData.name}" class="w-72 mask mask-hexagon-2"/>
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
                  <BoardgameLink id={bg.id} title={bg.title} release={bg.release} slug={bg.slug}/>
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