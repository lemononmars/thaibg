<script lang="ts" context="module">
   export async function load({ session, params }) {
      const { user } = session
      let content, boardgames, creators
      await fetch(`/api/content/${params.id}`)
         .then(res => res.json())
         .then(data => content = data)
      await fetch(`/api/content/${params.id}/boardgame`)
         .then(res => res.json())
         .then(data => boardgames = data)
      await fetch(`/api/content/${params.id}/contentcreator`)
         .then(res=> res.json())
         .then(data => creators = data)
         .catch(error => {return {status:404, message:'content creator not found'}})

      let people = []
      for(const c in creators) {
         await fetch(`/api/contentcreator/${creators[c].Creator_ID}/person`)
            .then(res =>res.json())
            .then(data => people = [...people, data])
      }

       return {
           props: {
               user,
               boardgames, content, people
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   import PersonCard from '$lib/components/PersonCard.svelte'

   export let user, boardgames, content, people
</script>

<Seo title="Event"/>
<div class="flex flex-col lg:flex-row justify-center mt-10">
   <div class="flex flex-col lg:gap-4 px-4 text-left w-1/3">
      <img src="{getImageURL('event', content.Content_picture )}" alt="image of {content.Content_name}" class="w-72 h-72 object-contain mask mask-hexagon-2"
         on:error|once={(ev)=>ev.target.src = getDefaultImageURL('event')}
      />
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
            {#each boardgames as bg}
               <BoardgameCard {bg}/>
            {/each}
         </div>
      <h2>Created by</h2>
         <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {#each people as person}
               <PersonCard {person}/>
            {/each}
         </div>
   </div>
</div>