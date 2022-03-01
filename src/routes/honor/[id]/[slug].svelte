<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Honor').select('*').eq('Honor_ID', params.id)
       const {data: honorees, error: error2} = await from ('Honor_Relation')
         .select('*')
         .eq('Honor_ID', params.id)

       if(error || error2) 
         return { status: 404 }
      
       return {
           props: {
               user,
               honorData: data[0],
               honorees
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export let user, honorData, honorees
</script>

<Seo title="Honor"/>
<div class="flex flex-row justify-center items-center relative">
   <div class="flex flex-col flex-start gap-2 text-left m-4 w-1/3">
      <img 
         src="{getImageURL('honor', honorData.Honor_picture)}" 
         alt="image of {honorData.Honor_name}" 
         class="w-72 h-72 mask mask-hexagon-2 object-contain"
         on:error|once={(ev)=>ev.target.src = getDefaultImageURL('honor')}
      />
      <h1>{honorData.Honor_name}</h1>
      <h2>{honorData.Honor_name_th? "(" + honorData.Honor_name_th + ")": ""}</h2>
      {#if honorData.Honor_link}
         <a href="{honorData.Honor_link}" target="_blank">{honorData.Honor_link}</a>
      {:else}
         N/A
      {/if}
      <h2>Description</h2>
      <p>{@html honorData.Honor_description || 'N/A'}</p>
      <div class="divider"></div>
      <!-- social share-->
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
   <div>
      {#if honorees}
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
                  {#each honorees as h}
                     <tr>
                        <td>{h.Honor_position}</td>
                        <td>
                           {#if h.TBG_ID}
                              <a href="/boardgame/{h.TBG_ID}">{h.TBG_name}</a>
                           {:else}
                              {h.TBG_name}
                           {/if}
                        </td>
                     </tr>
                  {/each}
               </tbody>
            </table>
         </div>
      {:else}
         <Spinner/>
      {/if}
   </div>
   
</div>