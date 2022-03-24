<script lang="ts" context="module">
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export async function getDesignerImageURLs(id) {
      const res = await fetch(`/api/boardgame/${id}/designer`)
      if(!res.ok) return []

      let data = await res.json()
      let URLs = []
      for(let d in data) {
         const resDesigner = await fetch(`/api/designer/${data[d].Designer_ID}/person`)
         const person = await resDesigner.json()
         URLs = [...URLs, getImageURL('person', person[0].Person_picture)]
      }

      return URLs
   }
</script>

<script lang="ts">
   export let bg

   let id: string = bg.TBG_ID
   let slug: string = bg.TBG_slug
   let picture: string = getImageURL('boardgame', bg.TBG_picture)
   let name: string  = bg.TBG_name || bg.TBG_name_th || ''
   let description: string = bg.TBG_description?.slice(0,50) || ''

   let promiseDesignerImageURLs = getDesignerImageURLs(id)
</script>

<a href="/boardgame/{id}/{slug}">
   <div class="relative card w-auto ratio-aspect lg:w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure>
         <img src="{picture}" 
            class="object-cover h-48 aspect-auto" 
            alt="picture of {name}"
            on:error|once={(ev)=>ev.target.src = getDefaultImageURL('boardgame')}
         >
      </figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name}</h2>
      <p class="line-clamp-2 break-words">{description}</p>
      </div>

      <div class="avatar-group -space-x-6 absolute top-0 right-0 m-1 ">
         {#await promiseDesignerImageURLs then urls}
            {#each urls as url}
               <div class="relative avatar group-hover:animate-pulse">
                  <div class="w-12 h-12">
                     <img src="{url}" alt="designer images" class="object-contain"
                        on:error|once={(ev)=>ev.target.src = getDefaultImageURL('person')}
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