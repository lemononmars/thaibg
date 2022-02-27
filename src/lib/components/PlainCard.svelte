<script lang="ts">
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   interface plainObject{
      id: string,
      slug: string,
      type: string,
      picture: string,
      name: string
   }
   export let object: plainObject
   object.picture = DIR_IMAGE + `/${object.type}/` + (object.picture || URL_BLANK_IMAGE)
</script>

<a href="/{object.type}/{object.id}/{object.slug}">
   <div class="relative card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{object.picture}" class="object-cover h-48 aspect-auto" alt="picture of {object.name}"></figure>
      <div class="card-body">
      <h2 class="card-title truncate">{object.name}</h2>
      </div>
   </div>
</a>