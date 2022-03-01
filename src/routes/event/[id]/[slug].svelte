<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Event').select('*').eq('Event_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               eventData: data[0] || null
           }
       };
   }

   export async function getBoardgames(id){
      const {data, error} = await from('Boardgame')
         .select('*, Event_Relation!inner(*)')
         .eq('Event_Relation.Event_ID', id)
         
      if(error) throw error
      return data
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export let user, eventData
   let promise = getBoardgames(eventData.Event_ID)

</script>

<Seo title="Event"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !eventData}
         Invalid event ID!
      {:else}
         <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
            <img src="{getImageURL('event',eventData.Event_picture)}" alt="image of {eventData.Event_name}" class="w-72 mask mask-hexagon-2"
               on:error|once={(ev)=>ev.target.src = getDefaultImageURL('event')}
            />
            <div>
               <h1>{eventData.Event_name}</h1>
               <h2>{eventData.Event_name_th? "(" + eventData.Event_name_th + ")": ""}</h2>
               <ul>
                  <li>Period: {eventData.Event_period || 'N/A'}</li>
                  <li>Location: {eventData.Event_location || 'N/A'} </li>
                  <li>Link: 
                     {#if eventData.Event_link}
                        <a href="{eventData.Event_link}" target="_blank">{eventData.Event_link}</a>
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
            <p>{@html eventData.Event_description || 'N/A'}</p>
         </div>
         <div class="divider"></div>
         <h2>Boardgames released during this event</h2>
         <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {#await promise}
               <Spinner/>
            {:then boardgames}
               {#each boardgames as bg}
                  <BoardgameCard {bg}/>
               {:else}
                  None
               {/each}
            {/await}
         </div>
      {/if}
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>