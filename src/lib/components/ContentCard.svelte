<script lang="ts">
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   import { onMount } from 'svelte';
   import {from} from '$lib/supabase'

   export let content
   let id = content.Content_ID
   let media = content.Content_media
   let type = content.Content_type
   let name = content.Content_name
   let link = content.Content_link
   let picture = content.Content_picture || DIR_IMAGE + '/content/' + URL_BLANK_IMAGE
   let creatorPictureUrls = []

   console.log('about to mount')
   onMount(async()=>{
      let {data, error} = await from('Creator')
         .select('*, Creator_Relation!inner(*)')
         .eq('Creator_Relation.Content_ID', id)

      // TODO: scrape og:image
      
      if(error)
         throw(error)
      else
         creatorPictureUrls = data.map((d)=>
         DIR_IMAGE + '/creator/' + (d.Creator_picture || URL_BLANK_IMAGE)
      )
   })
</script>

<a href="/content/{content.Content_ID}">
   <div class="relative group card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{picture}" class="object-cover h-48 aspect-auto group-hover:scale-120 " alt="content thumbnail"></figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name}</h2>
      <div>
         <div class="badge">{media}</div>
         <div class="badge badge-outline">{type}</div>
      </div>
      </div>

      <div class="avatar-group -space-x-6 absolute top-0 right-0 m-1 ">
         {#each creatorPictureUrls as url}
            <div class="relative avatar group-hover:animate-pulse">
               <div class="w-12">
                  <img src="{url}" alt="creator thumbnail">
               </div>
            </div>
         {:else}
            <div></div>
         {/each}
      </div>
   </div>
</a>