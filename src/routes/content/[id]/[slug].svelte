<script lang="ts" context="module">
   export async function load({ params, fetch }) {
      let content, boardgames, creators
      await fetch(`/api/content/${params.id}`)
         .then(res => res.json())
         .then((data: Content) => content = data)
      await fetch(`/api/content/${params.id}/boardgame`)
         .then(res => res.json())
         .then((data: Boardgame[]) => boardgames = data)
      await fetch(`/api/content/${params.id}/contentcreator`)
         .then(res=> res.json())
         .then((data: Contentcreator[]) => creators = data)

      let people = []
      for(const c in creators) {
         await fetch(`/api/contentcreator/${creators[c].Contentcreator_ID}/person`)
            .then(res =>res.json())
            .then((data: Person[]) => {
               if(data[0])
                  people = [...people, data[0]]
            })
      }

       return {
           props: {
               boardgames, content, people
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import PersonCard from '$lib/components/PersonCard.svelte'
   import type {Boardgame, Content, Person, Contentcreator} from '$lib/datatypes'
   import {_} from 'svelte-i18n'

   export let boardgames: Boardgame[]
   export let content: Content
   export let people: Person[]
</script>

<Seo title="Event"/>
<div class="flex flex-col lg:flex-row justify-center mt-10">
   <div class="flex flex-col lg:gap-4 px-4 text-left w-1/3">
      <h1>{content.Content_name}</h1>
      <div class="flex flex-row gap-2">
         <div class="badge">{$_('content.media.' + content.Content_media)}</div>
         <div class="badge badge-outline">{$_('content.type.' + content.Content_type)}</div>
      </div>
      <h3>Link</h3> 
      {#if content.Content_link}
         <a href="{content.Content_link}" target="_blank">{content.Content_link}</a>
      {:else}
         N/A
      {/if}
      <h2>{$_('description._')}</h2>
      <p>{@html content.Content_description || 'N/A'}</p>
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