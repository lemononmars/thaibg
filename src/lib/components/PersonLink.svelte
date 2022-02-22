<script lang="ts">
   export let id: number
   export let slug: string
   export let picture: string
   export let name: string
   export let type: string
</script>

<a href="/{type}/{id}/{slug}">
   <div class="relative aspect-square shadow-xl transition ease-in-out hover:opacity-80  hover:scale-105 duration-300 rounded-xl flex flex-col justify-center bg-origin-border bg-cover"
   style="background-image:url({picture})">
      <div class='absolute bottom-2 inset-x-2 p-auto glass rounded-lg'>
         <p class="text-2xl text-primary-content">{name}</p> 
      </div>
   </div> 
</a>