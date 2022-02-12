<script lang="ts">

   export let id: number
   export let slug: string
   export let title: string
   export let release: number
</script>

<a href="/boardgame/{id}">
   <div class="relative aspect-square w-40 lg:w-72 shadow-xl transition ease-in-out hover:opacity-80 hover:-translate-y-0 hover:scale-105 duration-300 rounded-xl flex flex-col justify-center bg-origin-border bg-cover"
   style="background-image:url({slug})">
      <div class='absolute bottom-5 inset-x-2 p-auto glass rounded-lg'>
         <p class="text-2xl text-primary-content">{title} ({release})</p> 
      </div>
   </div> 
</a>