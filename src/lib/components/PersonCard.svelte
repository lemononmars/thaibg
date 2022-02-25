<script lang="ts">
   export let id: number
   export let slug: string
   export let picture: string
   export let name: string
   export let type: string
</script>

<!-- <a href="/{type}/{id}/{slug}">
   <div class="relative aspect-square shadow-xl transition ease-in-out hover:opacity-80  hover:scale-105 duration-300 rounded-xl flex flex-col justify-center bg-origin-border bg-cover"
   style="background-image:url({picture})">
      <div class='absolute bottom-2 inset-x-2 p-auto glass rounded-lg'>
         <p class="text-2xl text-primary-content">{name}</p> 
      </div>
   </div> 
</a> -->


<a href="/{type}/{id}/{slug}">
   <div class="relative group card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{picture}" class="object-cover h-48 aspect-auto group-hover:scale-120 " alt="picture of {name}"></figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name}</h2>
      <p class="truncate">{type}</p>
      </div>
   </div>
</a>