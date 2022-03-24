<script lang="ts" context="module">
   export async function load({ params }) {
       const res = await fetch(`/api/publisher/${params.id}`)
       if(!res.ok) return {status:400}

       const data = await res.json()
       return {
           props: {
               publisherData: data
           }
       };
   }

   export async function getBoardgames(PublisherID: number) {
      const res = await fetch(`/api/publisher/${PublisherID}/boardgame`)
      if(!res.ok) return {status: 404, message: 'not found'}
      
      const data = await res.json()
      return data
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   import type {Publisher, Boardgame} from '$lib/datatypes'
   import { _ } from 'svelte-i18n'

   export let publisherData: Publisher
   let boardgameData: Promise<Boardgame[]>
   onMount(async ()=>{
      boardgameData = getBoardgames(publisherData.Publisher_ID)
   })
   
</script>

<Seo title="Publisher"/>
<div class="flex flex-row justify-center mt-4">
   <div class="flex flex-col w-full lg:w-1/4 text-left m-4">
      <img src="{getImageURL('publisher', publisherData.Publisher_picture)}" alt="image of {publisherData.Publisher_name}" class="w-72" 
         on:error|once={(ev)=>ev.target.src = getDefaultImageURL('publisher')}
      />
      <div>
         <h1>{publisherData.Publisher_name || 'No title'}</h1>
         <div>
            <h2>Description</h2>
            <p>{@html publisherData.Publisher_description || 'N/A'}</p>
         </div>
         <ul>
            <li>Official link: 
               {#if publisherData.Publisher_link}
                  <a href="{publisherData.Publisher_link}" target="_blank">{publisherData.Publisher_link}</a>
               {:else}
                  N/A
               {/if}
            </li>
         </ul>
      </div>
   </div>
      
   <div class="text-left w-full lg:w-3/4">
      <h2>Publications</h2>
      {#await boardgameData}
         <Spinner/>
      {:then boardgames}
         {#if boardgames}
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
               {#each boardgames as bg}
                  <BoardgameCard {bg}/>
               {:else}
                  {$_('incomplete')}
               {/each}
            </div>
         {/if}
      {/await}
   </div>
</div>