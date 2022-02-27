<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Influencer').select('*').eq('Influencer_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               influencerData: data[0] || null
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'

   export let user, influencerData
   let contentData = []
   onMount(async ()=>{
      const {data, error} = await from('Content')
         .select('*, Influencer_Relation!inner(*)')
         .eq('Influencer_Relation.Influencer_ID', influencerData.Influencer_ID)
      if(error) throw error
      contentData = data

      influencerData.Influencer_picture = DIR_IMAGE + '/influencer/' + (influencerData.Influencer_picture || URL_BLANK_IMAGE)
   })
   
</script>

<Seo title="Influencer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !influencerData}
         Invalid influencer ID!
      {:else}
         {#if contentData}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{influencerData.Influencer_picture}" alt="image of {influencerData.Influencer_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{influencerData.Influencer_name_th}</h1>
                  <h2>{influencerData.Influencer_name? "(" + influencerData.Influencer_name + ")": ""}</h2>
                  <ul>
                     <li>Channel: {influencerData.Influencer_channel || 'N/A'}</li>
                     <li>Official link: 
                        {#if influencerData.Influencer_link}
                           <a href="{influencerData.Influencer_link}" target="_blank">{influencerData.Influencer_link}</a>
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
               <p>{@html influencerData.Influencer_description || 'N/A'}</p>
            </div>
            <div class="divider"></div>
            <h2>Contents</h2>
            <div class="w-full mb-4">
               <ul>
                  {#each contentData as c}
                  <li>
                     <div class="badge">{c.Content_type}</div>
                     <a href="{c.Content_link}" class="text-ellipsis" target="_blank">{c.Content_name}</a> 
                  </li>
                  {:else}
                     N/A
                  {/each}
               </ul>
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