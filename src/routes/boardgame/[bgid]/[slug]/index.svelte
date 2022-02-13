<script lang="ts" context="module">
   import {from} from '$lib/supabase'
   import {URL_BLANK_BG_IMAGE, DIR_IMAGE} from '$lib/constants'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('boardgame').select('*').eq('id', params.bgid)
       if(error) {}
       return {
           props: {
               user,
               bg: data[0]
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'

   export let user, bg
   let thumbnailUrl
   let designers
   let links
   let videos
   // let artists

   onMount(async ()=>{
      let res = await from('designer')
         .select('*, boardgame_designer_relation!inner(*)')
         .eq('boardgame_designer_relation.boardgame', bg.title)
      designers = res.data
      res = await from('link')
         .select('*')
         .eq('boardgame', bg.title)
      links = res.data
      res = await from('video')
         .select('*')
         .eq('boardgame', bg.title)
      videos = res.data

      thumbnailUrl = DIR_IMAGE + '/boardgame/' + (bg.thumbnail_url? bg.thumbnail_url : URL_BLANK_BG_IMAGE)
   })
</script>

<Seo title="Boardgame"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !bg}
         Invalid board game ID!
      {:else}
         {#if bg && designers && links && videos}
            <div class="flex flex-col lg:flex-row gap-4 w-full p-8 border-2 shadow-lg">
               <div class="flex flex-col items-center max-h-xs max-w-xs">
                  <img src="{thumbnailUrl}" alt="cover of {bg.title}">
               </div>
               <div class="grow">
                  <h1>{bg.title} ({bg.release})</h1>
                  {#if bg.title_th} <h2>({bg.title_th})</h2> {/if}
                  <ur>
                     <li>Designer: 
                        {#each designers as d, idx} 
                           {#if idx > 0},{/if}
                           <a href="/designer/{d.id}">{d.name}</a>
                        {:else} 
                           N/A
                        {/each}
                     </li>
                     <li>Artist: N/A</li>
                     <li>Publisher: {bg.publisher}</li>
                  </ur>
               </div>
            </div>

            <h2>Description</h2>
            {#if bg.description}<p class="text-left">{@html bg.description}</p>{/if}
            {#if bg.description_th}<p class="text-left">{@html bg.description_th}</p>{/if}
            <div class="divider"></div>
            <div>
               <h2>Links</h2><br> 
               {#each links as l}
                  <a href="{l.url}" class="text-ellipsis">{l.label}</a>
               {:else}
                  N/A
               {/each}
            </div>
            <div class="divider"></div>
            <div>
               <h2>Videos</h2><br>
               <div class="flex flex-col lg:flex-row items-center lg:justify-center gap-4">
                  {#each videos as v}
                        <div class="flex flex-col justify-center"><iframe width="280" height="150" src="{v.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <p>{v.label}</p>
                     </div>
                  {:else}
                     N/A
                  {/each}
               </div>
            </div>
            <div class="divider"></div>
            {#if user && !user.guest}
               <button class="btn">Suggest edit</button>
            {/if}
         {:else}
            <div>
               <Spinner/>
            </div>
         {/if}
      {/if}
   </div>
</div>