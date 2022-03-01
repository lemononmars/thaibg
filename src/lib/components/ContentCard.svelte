<script lang="ts" context="module">
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   export async function getCreatorImageURLs(id) {
      const {data, error} = await from('Creator')
         .select('Creator_picture, Creator_Relation!inner(*)')
         .eq('Creator_Relation.TBG_ID', id)

      let URLs = []
      for(let d in data)
         URLs = [...URLs, getImageURL('person', data[d].Creator_picture)]

      return URLs
   }
</script>

<script lang="ts">
   import {from} from '$lib/supabase'

   export let content
   let id = content.Content_ID
   let media = content.Content_media
   let type = content.Content_type
   let name = content.Content_name
   let link = content.Content_link
   let picture = getImageURL('content', content.Content_picture)
   let promiseCreatorImageURLs = getCreatorImageURLs(id)
</script>

<a href="/content/{content.Content_ID}">
   <div class="relative group card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure>
         <img src="{picture}" class="object-cover h-48 aspect-auto group-hover:scale-120 " alt="content thumbnail"
            on:error|once={(ev)=>ev.target.src = getDefaultImageURL('content')}
      ></figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name}</h2>
      <a href="{link}" target="_/">Link</a>
      <div>
         <div class="badge">{media}</div>
         <div class="badge badge-outline">{type}</div>
      </div>
      </div>

      <div class="avatar-group -space-x-6 absolute top-0 right-0 m-1 ">
         {#await promiseCreatorImageURLs then URLs}
            {#each URLs as url}
               <div class="relative avatar group-hover:animate-pulse">
                  <div class="w-12">
                     <img src="{url}" alt="creator thumbnail"
                     on:error|once={(ev)=>ev.target.src = getDefaultImageURL('creator')}
                  >
                  </div>
               </div>
            {:else}
               <div></div>
            {/each}
         {/await}
      </div>
   </div>
</a>