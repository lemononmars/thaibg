<script lang="ts" context="module">
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
</script>

<script lang="ts">
   
   import designerIcon from '$lib/assets/designer-icon.jpg'
   import artistIcon from '$lib/assets/artist-icon.jpg'
   import creatorIcon from '$lib/assets/creator-icon.jpg'
   import graphicdesignerIcon from '$lib/assets/graphicdesigner-icon.jpg'
   export let person

   let id = person.Person_ID
   let slug = person.Person_slug
   let picture = getImageURL('person', person.Person_picture)
   let name = person.Person_name
   let name_th = person.Person_name_th
   const roleTitles = ['designer', 'artist', 'creator', 'graphicdesigner'] // to be replaced by proper icons
   const roleIcons = [designerIcon, artistIcon, creatorIcon, graphicdesignerIcon]
   let roles = [ // true if the id is not null
      !!person.Designer_ID,
      !!person.Artist_ID,
      !!person.Creator_ID,
      !!person.graphicdesigner_ID
   ]
</script>

<a href="/person/{id}/{slug}">
   <div class="relative group card w-64 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{picture}" 
         class="object-cover h-64 aspect-auto group-hover:scale-120 " 
         alt="picture of {name}"
         on:error|once={(ev)=>ev.target.src = getDefaultImageURL('person')}
      >
      </figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name || ''}</h2>
      <h3 class="card-title truncate">{name_th || ''}</h3>
      </div>
      <div class="avatar-group -space-x-6 absolute top-0 right-0 m-1 ">
         {#each roles as role, idx}
            {#if role}
               <div class="relative avatar group-hover:animate-pulse tooltip">
                  <div class="w-12 h-12 tooltip" data-tip="{roleTitles[idx]}">
                     <img src="{roleIcons[idx]}" alt="role icon">
                  </div>
               </div>
            {/if}
         {:else}
            <div></div>
         {/each}
      </div>
   </div>
</a>