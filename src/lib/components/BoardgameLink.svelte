<script lang="ts">
   export let id: number
   export let thumbnail_url: string
   export let title: string
   export let release: number
</script>

<a href="/boardgame/{id}">
   <div class="card shadow-xl image-full">
      <figure>
         <img src="{thumbnail_url? thumbnail_url: "https://picsum.photos/300/300"}" alt="cover of {title}">
      </figure> 
      <div class="justify-end card-body">
         <h2 class="card-title">{title} ({release})</h2> 
      </div>
   </div> 
</a>