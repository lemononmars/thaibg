<script lang="ts">
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   export let event

   let id = event.Event_ID
   let name = event.Event_name
   let description = event.Event_description
   let duration = event.Duration
   let picture = getImageURL('event', event.Event_picture)
   // let creatorPictureUrls = []
</script>

<a href="/event/{id}">
   <div class="relative group card w-64 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{picture}" class="object-cover h-64 aspect-auto group-hover:scale-120 " alt="picture of {name}"
         on:error|once={(ev)=>ev.target.src = getDefaultImageURL('event')}
      ></figure>
      <div class="card-body">
         <div class='flex flex-row gap-1'>
            <div class='-translate-y-1 w-20 h-12 border border-t-red-400 border-t-8'>
               {duration || '1 \n JAN'}
            </div>
            <h2 class="card-title">{name}</h2>
         </div>
      </div>
      <div class="truncate">
         {description || 'Fun event'}
      </div>
   </div>
</a>