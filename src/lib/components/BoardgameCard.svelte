<script lang="ts" context="module">
   import {from, getImageURL, getDefaultImageURL} from '$lib/supabase'

   export async function getDesignerImageURLs(id) {
      const {data, error} = await from('Designer')
         .select('Designer_picture, Designer_Relation!inner(*)')
         .eq('Designer_Relation.TBG_ID', id)

      let URLs = []
      for(let d in data)
         URLs = [...URLs, getImageURL('person', data[d].Designer_picture)]

      return URLs
   }
</script>

<script lang="ts">
   export let bg

   let id: string = bg.TBG_ID
   let slug: string = bg.TBG_slug
   let picture = getImageURL('boardgame', bg.TBG_picture)
   let name: string  = bg.TBG_name || bg.TBG_name_th || ''
   let description: string = bg.TBG_description?.slice(50) || ''

   let promiseDesignerImageURLs = getDesignerImageURLs(id)
</script>

<a href="/boardgame/{id}/{slug}">
   <div class="relative card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure>
         <img src="{picture}" 
            class="object-cover h-48 aspect-auto" 
            alt="picture of {name}"
            on:error|once={(ev)=>ev.target.src = getDefaultImageURL('boardgame')}
         >
      </figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name}</h2>
      <p class="truncate">{description}</p>
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