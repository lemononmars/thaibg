<script lang="ts">
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   interface plainObject{
      id: string,
      slug: string,
      type: string,
      picture: string,
      name: string
   }
   export let object: plainObject
</script>

<a href="/{object.type}/{object.id}/{object.slug}">
   <div class="relative card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{getImageURL(object.type, object.picture)}" class="object-cover h-48 aspect-auto" alt="picture of {object.name}"
         on:error|once={(ev)=>ev.target.src = getDefaultImageURL(object.type)}
      ></figure>
      <div class="card-body">
      <h2 class="card-title truncate">{object.name}</h2>
      </div>
   </div>
</a>