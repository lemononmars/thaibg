<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
      const { user } = session

      const {data, error} = await from('Content')
         .select('*')
         .eq('Content_ID', params.id)
      const content = data[0]
      const {data: bg, error: error2} = await from('Boardgame')
         .select('*')
         .eq('TBG_ID', content.TBG_ID)
      const {data: c, error: error3} = await from('Creator')
         .select('*, Creator_Relation!inner(*)')
         .eq('Creator_Relation.Content_ID', content.Content_ID)

      // TO FIX: for now, assume there's only one creator
      const {data: p, error: error4} = await from('Person')
         .select('*')
         .eq('Creator_ID', c[0].Creator_ID)

       if(error || error2 || error3 || error4) 
         return {status:404}

       return {
           props: {
               user,
               bg: bg[0],
               content, 
               creators: p
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   import PersonCard from '$lib/components/PersonCard.svelte'

   export let user, content, bg, creators
   console.log(bg)
   content.Content_picture = DIR_IMAGE + '/event/' + (content.Content_picture || URL_BLANK_IMAGE)
</script>

<Seo title="Event"/>
<div class="flex flex-col lg:flex-row justify-center mt-10">
   <div class="flex flex-col lg:gap-4 px-4 text-left w-1/3">
      <!-- <img src="{content.Content_picture}" alt="image of {content.Content_name}" class="w-72 h-72 object-contain mask mask-hexagon-2"/> -->
      <h1>{content.Content_name}</h1>
      <h2>{content.Content_name_th? "(" + content.Content_name_th + ")": ""}</h2>
      <div class="flex flex-row gap-2">
         <div class="badge">{content.Content_media}</div>
         <div class="badge badge-outline">{content.Content_type}</div>
      </div>
      <h3>Link</h3> 
      {#if content.Content_link}
         <a href="{content.Content_link}" target="_blank">{content.Content_link}</a>
      {:else}
         N/A
      {/if}
      <h2>Description</h2>
      <p>{@html content.Content_description || 'N/A'}</p>
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
   <div class="flex flex-col w-2/3 text-left">
      <h2>Featured Board Games</h2>
      <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
         <BoardgameCard {bg}/>
      </div>
      <h2>Created by</h2>
      <div>
         {#each creators as person}
            <PersonCard {person}/>
         {/each}
      </div>
   </div>
</div>