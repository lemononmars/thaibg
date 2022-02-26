<script lang="ts">
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   import { onMount } from 'svelte';
   import {from} from '$lib/supabase'
   export let bg

   let id: string = bg.TBG_ID
   let slug: string = bg.TBG_slug
   let picture: string = DIR_IMAGE + '/boardgame/' + (bg.TBG_picture || URL_BLANK_IMAGE)
   let name: string  = bg.TBG_name
   //let released: number = bg.TBG_released
   let description: string = bg.TBG_description?.slice(50) || ''
   let designerPictureUrls: string[] = []

   onMount(async()=>{
      let {data, error} = await from('Designer')
         .select('*, Designer_Relation!inner(*)')
         .eq('Designer_Relation.TBG_ID', bg.TBG_ID)

      if(error) 
         throw(error)
      else
         designerPictureUrls = data.map((d)=>
            DIR_IMAGE + '/designer/' + (d.Designer_picture || URL_BLANK_IMAGE)
      )
   })
</script>
<!-- 
<a href="/boardgame/{id}/{slug}">
   <div class="relative aspect-square shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-300 rounded-xl lg:bg-origin-border bg-cover"
   style="background-image:url({picture})">
      <div class='absolute bottom-2 inset-x-2 p-auto glass rounded-lg'>
         <p class="text-sm lg:text-xl text-primary-content">{name} ({released})</p> 
      </div>
   </div> 
</a> -->

<a href="/boardgame/{id}/{slug}">
   <div class="relative card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{picture}" class="object-cover h-48 aspect-auto" alt="picture of {name}"></figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name}</h2>
      <p class="truncate">{description}</p>
      </div>

      <div class="avatar-group -space-x-6 absolute top-0 right-0 m-1 ">
         {#each designerPictureUrls as url}
            <div class="relative avatar group-hover:animate-pulse">
               <div class="w-12">
                  <img src="{url}" alt="designer images">
               </div>
            </div>
         {:else}
            <div></div>
         {/each}
      </div>
   </div>
</a>