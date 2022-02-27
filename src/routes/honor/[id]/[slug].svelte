<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Honor').select('*').eq('Honor_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               honorData: data[0] || null
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'

   export let user, honorData
   
   let boardgameData
   let loaded = false
   onMount(async ()=>{
      // TODO: also filter board game ID and create the card
      //
      // const {data, error} = await from('Boardgame')
      //    .select('*, Honor_Relation!inner(*)')
      //    .eq('Honor_Relation.TBG_ID', honorData.TBG_ID)
         
      const {data, error} = await from ('Honor_Relation')
         .select('*')
         .eq('Honor_ID', honorData.Honor_ID)

      if(error) throw error
      boardgameData = data
      honorData.Honor_picture = DIR_IMAGE + '/honor/' + (honorData.Honor_picture || URL_BLANK_IMAGE)
      loaded = true

   })
   
</script>

<Seo title="Honor"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !honorData}
         Invalid honor ID!
      {:else}
         {#if honorData}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{honorData.Honor_picture}" alt="image of {honorData.Honor_name}" class="w-72 mask mask-hexagon-2"/>
               <div>
                  <h1>{honorData.Honor_name}</h1>
                  <h2>{honorData.Honor_name_th? "(" + honorData.Honor_name_th + ")": ""}</h2>
                  <ul>
                     <li>Official link: 
                        {#if honorData.Honor_link}
                           <a href="{honorData.Honor_link}" target="_blank">{honorData.Honor_link}</a>
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
               <p>{@html honorData.Honor_description || 'N/A'}</p>
            </div>
            <div class="divider"></div>
            {#if loaded}
               <h2>Winners</h2>
               <div class="overflow-x-auto">
                  <table class="table table-zebra">
                  <!-- head -->
                  <thead>
                     <tr>
                        <th>Position</th>
                        <th>Winner</th>
                     </tr>
                  </thead>
                     <tbody>
                        {#each boardgameData as bg}
                           <tr>
                              <td>{bg.Honor_position}</td>
                              <td>{bg.TBG_name}</td>
                           </tr>
                        {/each}
                     </tbody>
                  </table>
               </div>
            {:else}
               <Spinner/>
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