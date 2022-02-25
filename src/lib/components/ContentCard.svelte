<script lang="ts">
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   import { onMount } from 'svelte';
   import {from} from '$lib/supabase'

   export let content

   let id = content.Content_ID
   let link = content.Content_link
   let type = content.Content_channel
   let name = content.Content_name
   let picture // auto-generate thumbnail?
   let creatorPictureUrls = []

   onMount(async()=>{
      let {data, error} = await from('Influencer')
         .select('*, Influencer_Relation!inner(*)')
         .eq('Influencer_Relation.Content_ID', id)

      console.log(data)
      if(error) 
         throw(error)
      else
         creatorPictureUrls = data.map((d)=>
         DIR_IMAGE + '/influencer/' + (d.Influencer_picture || URL_BLANK_IMAGE)
      )
   })
</script>

<a href="{link}" target="_/">
   <div class="relative group card w-72 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group">
      <figure><img src="{picture}" class="object-cover h-48 aspect-auto group-hover:scale-120 " alt="picture of {name}"></figure>
      <div class="card-body">
      <h2 class="card-title truncate">{name}</h2>
      <div class="badge">{type}</div>
      </div>

      <div class="avatar-group -space-x-6 absolute top-0 right-0 m-1 ">
         {#each creatorPictureUrls as url}
            <div class="relative avatar group-hover:animate-pulse">
               <div class="w-12">
                  <img src="{url}">
               </div>
            </div>
         {:else}
            <div></div>
         {/each}
      </div>
   </div>
</a>