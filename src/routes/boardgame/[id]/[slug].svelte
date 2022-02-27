<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
      const { user } = session
      const {data, error} = await from('Boardgame').select('*').eq('TBG_ID', params.id)
      if(error)
      return {
         status: 404,
      }

      let designers, artists, publishers, contents
      let types, mechanics, categories
      let bg = data[0]
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

      return {
         props: {
            user,
            bg, designers, artists, publishers, contents, types, mechanics, categories
         }
      };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import ContentCard from '$lib/components/ContentCard.svelte'
   import {StarIcon, UserIcon, UsersIcon, ClockIcon, FeatherIcon, EditIcon, HomeIcon} from 'svelte-feather-icons'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   import Social from '$lib/components/Social.svelte'

   export let user
   export let bg, designers, artists, publishers, contents, types, mechanics, categories

   let favorite: boolean = false // to be fetched from user
   $: numFavorites = 9 + (favorite?1:0)

   let filteredContents = contents
   let contentFilter = [true, false, false, false, false]
   let contentTitle = ['All', 'Article', 'Video', 'Podcast','File']
   function contentFilterChange(option){
      contentFilter = contentFilter.map((c, idx)=>idx === option)
      if(option == 0)
         filteredContents = contents
      else
         filteredContents = contents.filter((c)=>c.Content_type === contentTitle[option])
      filteredContents = filteredContents
   }
</script>

<Seo title="Boardgame"/>

<div class="w-full h-32">
   <img src="https://picsum.photos/seed/picsum/800/600" alt="cover image" class="object-cover w-full h-60">
</div>

<div class="flex flex-row text-left gap-6">
   <!-- First column-->
   <div class="flex flex-col gap-4">
      <div class="mx-auto">
         <img src="{DIR_IMAGE + '/boardgame/' + (bg.TBG_picture || URL_BLANK_IMAGE)}" alt="cover of {bg.TBG_name}" class="hover:scale-110 w-60 aspect-auto duration-300"/>
      </div>
      <div>
         <h3>Designer</h3>
         {#await designers then designers}
         {#each designers as d} 
            <div class="flex flex-row items-center gap-2">
               <div class="avatar">
                  <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
                  <img src="{DIR_IMAGE + '/designer/' + (d.Designer_picture || URL_BLANK_IMAGE)}" alt="avatar">
                  </div>
               </div>
               <a href="/designer/{d.Designer_ID}">{d.Designer_name}</a>
            </div>
         {:else} 
            N/A
         {/each}
         {/await}
      </div>
      <div>
      <h3>Artist</h3>
         {#each artists as a} 
         <div class="flex flex-row items-center gap-2">
            <div class="avatar">
               <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
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
         <h3>Publisher</h3>
         {#each publishers as p} 
         <div class="flex flex-row items-center gap-2">
            <div class="avatar">
               <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
               <img src="{DIR_IMAGE + '/publisher/' + (p.Publisher_picture || URL_BLANK_IMAGE)}" alt="avatar">
               </div>
            </div>
            <a href="/designer/{p.Publisher_ID}">{p.Publisher_name}</a>
         </div>
         {:else} 
            -
         {/each}
      </div>
      <div class="divider"></div>
      <div>
         <h3>Playable at</h3>
      </div>
      <div>
         <h3>Buy at</h3>
      </div>
   </div>
   <!-- Second column -->
   <div class="flex flex-col justify-center gap-4 pt-10 w-1/2">
      <div class="flex flex-row items-center">
         <Social url="https://thaibg.herokuapp.com/boardgame/{bg.TBG_ID}" title="{bg.TBG_name}"/>
         
         {#if bg.TBG_link} 
            <a href="{bg.TBG_link}" target="_blank">
               <div class="btn"><HomeIcon size="20"/></div>
            </a>
         {/if}
         {#if user && !user.guest}
            <div class="btn btn-xs btn-secondary m-4 flex flex-row items-center gap-2">Edit <EditIcon size="20"/></div>
         {/if}
      </div>
      <div class="flex flex-row justify-between items-center">
         <div>
            <h1>{bg.TBG_name}</h1>
            {#if bg.TBG_name_th} <h2>({bg.TBG_name_th})</h2> {/if}
            <h2>({bg.TBG_released})</h2>
         </div>
         <div class="tooltip" data-tip="{favorite? 'Unlike':'Like'}">
            <label>
               <input type="checkbox" bind:checked={favorite} class="hidden">
               <div class:text-yellow-300={favorite}><StarIcon size="40" /></div>
               {numFavorites}
            </label>
         </div>
      </div>

      <div class="flex flex-row gap-4">
         <div class="tooltip flex items-center flex-row gap-2" data-tip="Age">
            <UserIcon size="20"/>
            <p>{bg.TBG_age} +</p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="Number of players">
            <UsersIcon size="20"/>
            <p>{bg.TBG_player_min || ''}{bg.TBG_player_max? ' - ' + bg.TBG_player_max:''} player{bg.TBG_player_max > 1? 's':''}</p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="Playtime">
            <ClockIcon size="20"/>   
            <p>{bg.TBG_playtime_min || ''}{bg.TBG_playtime_max? ' - ' + bg.TBG_playtime_max : ''} minutes</p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="Weight">
            <FeatherIcon size="20"/>
            <p>{bg.TBG_weight || 'N/A'}</p>
         </div>
      </div>
      <div>
         {bg.TBG_description || 'N/A'}
      </div>
      <div class="divider"></div>
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
               <div class="badge badge-lg"><a href="/category/{c.Cat_ID}">{c.Cat_name}</a></div>
            {:else} 
               -
            {/each}
         </div>
      </div>
      <div class="divider"/>
      <div>
         <h2>Content</h2> 
         <div class="btn-group">
            {#each contentFilter as _,idx}
               <div 
                  class="btn btn-xs" 
                  class:btn-outline={!contentFilter[idx]}
                  on:click={()=>contentFilterChange(idx)}
                  >
                  {contentTitle[idx]}
                  </div
               >
            {/each}
         </div>
         <br> 
         {#each filteredContents as content}
            <ContentCard {content}/>
         {:else}
            N/A
         {/each}
      </div>
      <div class="divider"></div>
      <h3>Comments</h3>
      {#if user}
         <div class="form-control" method="post">
            <textarea class="textarea h-24 textarea-bordered" placeholder="Add comment"></textarea>
            <div class="btn" >Submit</div>
         </div>
      {/if}
   </div>
   <!-- third column-->
   <div class="flex flex-col gap-4 pt-28">
     
      <div>
         <h3>Event</h3>
      </div>
      <div class="divider"></div>
      <div>
         <h3>Photo</h3>
      </div>
   </div>
</div>