<script lang="ts" context="module">
   import {from} from '$lib/supabase'
   import {URL_BLANK_BG_IMAGE, DIR_IMAGE} from '$lib/constants'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Boardgame').select('*').eq('TBG_ID', params.id)
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
   let artists
   let publishers
   let contents
   // let artists

   onMount(async ()=>{
      let res = await from('Designer')
         .select('*, Designer_Relation!inner(*)')
         .eq('Designer_Relation.TBG_ID', bg.TBG_ID)
      designers = res.data
      res = await from('Artist')
         .select('*, Artist_Relation!inner(*)')
         .eq('Artist_Relation.TBG_ID', bg.TBG_ID)
      artists = res.data
      res = await from('Publisher')
         .select('*, Publisher_Relation!inner(*)')
         .eq('Publisher_Relation.TBG_ID', bg.TBG_ID)
      publishers = res.data
      res = await from('Content')
         .select('*')
         .eq('TBG_ID', bg.TBG_ID)
      contents = res.data

      thumbnailUrl = DIR_IMAGE + '/boardgame/' + (bg.TBG_picture || URL_BLANK_BG_IMAGE)
   })
</script>

<Seo title="Boardgame"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !bg}
         Invalid board game ID!
      {:else}
         {#if bg && designers && artists && publishers && contents}
            <div class="flex flex-col lg:flex-row gap-4 w-full p-8 border-2 shadow-lg">
               <div class="flex flex-col items-center max-h-xs max-w-xs">
                  <img src="{thumbnailUrl}" alt="cover of {bg.TBG_name}">
               </div>
               <div class="grow">
                  <h1>{bg.TBG_name} ({bg.TBG_released})</h1>
                  {#if bg.TBG_name_th} <h2>({bg.TBG_name_th})</h2> {/if}
                  <ur>
                     <li>Designers: 
                        {#each designers as d, idx} 
                           {#if idx > 0},{/if}
                           <a href="/designer/{d.Designer_ID}">{d.Designer_name}</a>
                        {:else} 
                           N/A
                        {/each}
                     </li>
                     <li>Artists: 
                        {#each artists as a, idx} 
                           {#if idx > 0},{/if}
                           <a href="/artist/{a.Artist_ID}">{a.Artist_name}</a>
                        {:else} 
                           N/A
                        {/each}
                     </li>
                     <li>Age: {bg.TBG_age} </li>
                     <li>Players: {bg.TBG_player_min || ''} - {bg.TBG_player_max || ''} </li>
                     <li>Playtime: {bg.TBG_playtime_min || ''} - {bg.TBG_playtime_max || ''} minutes </li>
                     <li>Weight: {bg.TBG_weight || '-'} </li>
                     <li>Official link: {#if bg.TBG_link} <a href="{bg.TBG_link}" target="_blank">{bg.TBG_link}</a> {:else} - {/if}</li>
                     <li>Publisher: 
                        {#each publishers as p, idx} 
                           {#if idx > 0},{/if}
                           <a href="/publisher/{p.Publisher_ID}">{p.Publisher_name}</a>
                        {:else} 
                           N/A
                        {/each}
                     </li>
                  </ur>
               </div>
            </div>
            <div class="divider"></div>
            <div>
               <h2>Contents</h2><br> 
               {#each contents as c}
               <a href="{c.Content_link}" class="text-ellipsis" target="_blank">{c.Content_name}</a> 
               <div class="badge">{c.Content_channel}</div>
               {:else}
                  N/A
               {/each}
            </div>
            <div class="divider"></div>
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