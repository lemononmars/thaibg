<script lang="ts">
   export let id: number
   export let thumbnail_url: string
   export let name: string
</script>

<a href="/designer/{id}">
   <div class="card shadow-xl image-full">
      <figure>
         <img src="{thumbnail_url? thumbnail_url: "https://picsum.photos/300/300"}" alt="cover of {name}">
      </figure> 
      <div class="justify-end card-body">
         <h2 class="card-title">{name}</h2> 
      </div>
   </div> 
</a>