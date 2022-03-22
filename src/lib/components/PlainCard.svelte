<script lang="ts">
   import type { TypeName } from '$lib/datatypes';

   import {getImageURL, getDefaultImageURL, getVarPrefix} from '$lib/supabase'
   export let object
   export let type: TypeName
   const typeVar = getVarPrefix(type) //capitalize first letter

   let id = object[typeVar + '_ID']
   let slug = object[typeVar + '_slug']
   let picture = object[typeVar + '_picture']
   let name = object[typeVar + '_name'] || object[typeVar + '_name_th']
</script>

<a href="/{type}/{id}/{slug}">
   <div class="relative card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{getImageURL(type, picture)}" class="object-cover h-48 aspect-auto" alt="picture of {name}"
         on:error|once={(ev)=>ev.target.src = getDefaultImageURL(type)}
      ></figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name}</h2>
      </div>
   </div>
</a>