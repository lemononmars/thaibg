<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Boardgame').select('*').eq('TBG_ID', params.id)
       if(error) {
          return {
            redirect: "/boardgame",
            status: 303
        }
       }
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
   import ContentCard from '$lib/components/ContentCard.svelte'
   import {onMount} from 'svelte'
   import {StarIcon, UserIcon, UsersIcon, ClockIcon, FeatherIcon} from 'svelte-feather-icons'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'

   export let user, bg
   let designers, artists, publishers, contents
   let types, mechanics, categories
   let loaded = false

   onMount(async ()=>{
      const BGID = bg.TBG_ID
      let res = await from('Designer')
         .select('*, Designer_Relation!inner(*)')
         .eq('Designer_Relation.TBG_ID', BGID)
      designers = res.data
      res = await from('Artist')
         .select('*, Artist_Relation!inner(*)')
         .eq('Artist_Relation.TBG_ID', BGID)
      artists = res.data
      res = await from('Publisher')
         .select('*, Publisher_Relation!inner(*)')
         .eq('Publisher_Relation.TBG_ID', BGID)
      publishers = res.data
      res = await from('Content')
         .select('*')
         .eq('TBG_ID', BGID)
      contents = res.data
      console.log(contents)
      res = await from('Type')
         .select('*, Type_Relation!inner(*)')
         .eq('Type_Relation.TBG_ID', BGID)
      types = res.data
      res = await from('Mechanics')
         .select('*, Mechanics_Relation!inner(*)')
         .eq('Mechanics_Relation.TBG_ID', BGID)
      mechanics = res.data
      res = await from('Category')
         .select('*, Category_Relation!inner(*)')
         .eq('Category_Relation.TBG_ID', BGID)
      categories = res.data
      loaded = true
   })
</script>

<Seo title="Boardgame"/>

<div class="w-full h-40">
   <img src="https://picsum.photos/seed/picsum/800/600" alt="cover image" class="object-cover w-full h-80">
</div>

{#if !loaded}
<Spinner/>
{:else}
<div class="flex flex-row text-left gap-6">
   <div class="flex flex-col gap-4">
      <div class="mx-auto">
         <img src="{DIR_IMAGE + '/boardgame/' + (bg.TBG_picture || URL_BLANK_IMAGE)}" alt="cover of {bg.TBG_name}" class="hover:animate-bounce w-60 aspect-auto"/>
      </div>
      <div>
         <h3>Designers</h3>
         {#each designers as d} 
            <div class="flex flex-row items-center gap-2">
               <div class="avatar">
                  <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105">
                  <img src="{DIR_IMAGE + '/designer/' + (d.Designer_picture || URL_BLANK_IMAGE)}" alt="avatar">
                  </div>
               </div>
               <a href="/designer/{d.Designer_ID}">{d.Designer_name}</a>
            </div>
         {:else} 
            N/A
         {/each}
      </div>
      <div>
      <h3>Artists</h3>
         {#each artists as a} 
         <div class="flex flex-row items-center gap-2">
            <div class="avatar">
               <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105">
               <img src="{DIR_IMAGE + '/artist/' + (a.Artist_picture || URL_BLANK_IMAGE)}" alt="avatar">
               </div>
            </div>
            <a href="/artist/{a.Artist_ID}">{a.Artist_name}</a>
         </div>
         {:else} 
            N/A
         {/each}
      </div>
      <div>
         <h3>Publishers</h3>
         {#each publishers as p} 
         <div class="flex flex-row items-center gap-2">
            <div class="avatar">
               <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105">
               <img src="{DIR_IMAGE + '/publisher/' + (p.Publisher_picture || URL_BLANK_IMAGE)}" alt="avatar">
               </div>
            </div>
            <a href="/designer/{p.Publisher_ID}">{p.Publisher_name}</a>
         </div>
         {:else} 
            -
         {/each}
      </div>
      <div class="bg-base-300">
         <h3>Playable at</h3>
      </div>
      <div class="bg-base-300">
         <h3>Buy at</h3>
      </div>
   </div>
   <!-- Second column -->
   <div class="flex flex-col justify-center gap-4 pt-20">
      <div>
         <div class="flex flex-row content-between">
            <div>
               <h1>{bg.TBG_name} ({bg.TBG_released})</h1>
               {#if bg.TBG_name_th} <h2>({bg.TBG_name_th})</h2> {/if}
            </div>
            <div>
               <StarIcon size="20"/>
            </div>
         </div>
      </div>
      <div class="flex flex-row items-center gap-2">
         <div class="tooltip" data-tip="Age">
            <UserIcon size="20"/>
         </div>
         <p>{bg.TBG_age} +</p>
         <div class="tooltip" data-tip="Number of players">
            <UsersIcon size="20"/>
         </div>
         <p>{bg.TBG_player_min || ''} {'-' + bg.TBG_player_max || ''} player{bg.TBG_player_max > 1? 's':''}</p>
         <div class="tooltip" data-tip="Playtime">
            <ClockIcon size="20"/>
         </div>
         <p>{bg.TBG_playtime_min || ''} {bg.TBG_playtime_max? '-' + bg.TBG_playtime_max : ''} minutes</p>
         <div class="tooltip" data-tip="Weight">
            <FeatherIcon size="20"/>
         </div>
         <p>{bg.TBG_weight || 'N/A'}</p>
      </div>
      <div>
         {bg.TBG_description || 'N/A'}
      </div>
      <div>
         <h3>Type</h3>
         <div class="flex flex-row gap-2 items-center">
            {#each types as t} 
               <div class="badge badge-lg"><a href="/type/{t.Type_ID}">{t.Type_name}</a></div>
            {:else} 
               -
            {/each}
         </div>
         <h3>Mechanics</h3>
         <div class="flex flex-row gap-2 items-center">
            {#each mechanics as m} 
               <div class="badge badge-lg"><a href="/mechanics/{m.Mech_ID}">{m.Mech_name}</a></div>
            {:else} 
               -
            {/each}
         </div>
         <h3>Category</h3>
         <div class="flex flex-row gap-2 items-center">
            {#each categories as c} 
               <div class="badge badge-lg"><a href="/category/{c.Category_ID}">{c.Category_name}</a></div>
            {:else} 
               N/A
            {/each}
         </div>
      </div>
      <h3>Official Link</h3>
      {#if bg.TBG_link} <a href="{bg.TBG_link}" target="_blank">{bg.TBG_link}</a> {:else} - {/if}
      <div class="divider"/>
      <div>
         <h2>Content</h2><br> 
         {#each contents as content}
            <ContentCard {content}/>
         {:else}
            N/A
         {/each}
      </div>
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>
{/if}