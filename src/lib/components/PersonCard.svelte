<script lang="ts">
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   export let person

   let id = person.Person_ID
   let slug = person.Person_slug
   let picture = getImageURL('person', person.Person_picture)
   let name = person.Person_name
   let name_th = person.Person_name_th
</script>

<a href="/person/{id}/{slug}">
   <div class="relative group card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{picture}" 
         class="object-cover h-48 aspect-auto group-hover:scale-120 " 
         alt="picture of {name}"
         on:error|once={(ev)=>ev.target.src = getDefaultImageURL('person')}
      >
      </figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name || name_th || 'No name'}</h2>
      <h3 class="card-title truncate">{name? name_th || '' : ''}</h3>
      </div>
   </div>
</a>