<script lang="ts">

   export let id: number
   export let slug: string
   export let picture: string
   export let name: string
   export let name_th: string
   export let release: number
</script>

<a href="/boardgame/{id}/{slug}">
   <div class="relative aspect-square w-40 lg:w-72 shadow-xl transition ease-in-out hover:opacity-80 hover:-translate-y-0 hover:scale-105 duration-300 lg:rounded-xl bg-origin-border bg-cover"
   style="background-image:url({picture})">
      <div class='absolute bottom-2 inset-x-2 p-auto glass rounded-lg'>
         <p class="text-sm lg:text-xl text-primary-content">{name} ({release})</p> 
      </div>
   </div> 
</a>