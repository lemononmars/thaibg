<script lang="ts">
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   export let bg

   let id: string = bg.TBG_ID
   let slug: string = bg.TBG_slug
   let picture: string = DIR_IMAGE + '/boardgame/' + (bg.TBG_picture || URL_BLANK_IMAGE)
   let name: string  = bg.TBG_name
   let released: number = bg.TBG_released
</script>

<a href="/boardgame/{id}/{slug}">
   <div class="relative aspect-square shadow-xl transition ease-in-out hover:opacity-80  hover:scale-105 duration-300 rounded-xl flex flex-col justify-center lg:bg-origin-border bg-cover"
   style="background-image:url({picture})">
      <div class='absolute bottom-2 inset-x-2 p-auto glass rounded-lg'>
         <p class="text-sm lg:text-xl text-primary-content">{name} ({released})</p> 
      </div>
   </div> 
</a>