<script lang="ts" context="module">
   import {getImageURL, getDefaultImageURL, getVarPrefix} from '$lib/supabase'

   export async function load({ session, params, fetch }) {
      let bg
      const { user } = session
      await fetch(`/api/boardgame/${params.id}`)
         .then(res => res.json())
         .then(data => bg = data)
         .catch(error => {return {status:400, message: error}})

      let types = [], mechanics = [], categories = [], contents = []
     
      await fetch(`/api/boardgame/${params.id}/type`)
         .then(res => res.json())
         .then(data => types = data)
      await fetch(`/api/boardgame/${params.id}/mechanics`)
         .then(res => res.json())
         .then(data => mechanics = data)
      await fetch(`/api/boardgame/${params.id}/category`)
         .then(res => res.json())
         .then(data => categories = data)
      await fetch(`/api/boardgame/${params.id}/content`)
         .then(res => res.json())
         .then(data => contents = data)

      return {
         props: {
            user,
            bg, types, mechanics, categories,contents
         }
      };
   }

   export async function getCreatorInfo(BGID) {
      let data = {designer:[], artist:[], graphicdesigner:[], playtester:[], rulebookeditor:[]}
      for(const r of Object.keys(data)) {
         const res = await fetch(`/api/boardgame/${BGID}/${r}`)
         if(res.ok) {
            const people = await res.json()
            // get the person data from each corresponding role
            // ex. /api/playtester/2/person
            for(const p of people){
               const resPerson = await fetch(`/api/${r}/${p[getVarPrefix(r)+'_ID']}/person`)
               if(!resPerson.ok)
                  break
               const person = await resPerson.json()
               data[r] = [...data[r], person[0]] // api returns an array, so pick only first one
            }
         }
      }
      await fetch(`/api/boardgame/${BGID}/publisher`)
         .then(res => res.json())
         .then(d => data['publisher'] = d)
         .catch(error => data['publisher'] = [])
      return data
   }

   export async function getEvents(BGID){
      return null
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import ContentCard from '$lib/components/ContentCard.svelte'
   import CommentSection from '$lib/components/CommentSection.svelte'
   import {StarIcon, UserIcon, UsersIcon, ClockIcon, FeatherIcon, EditIcon, LinkIcon, PackageIcon} from 'svelte-feather-icons'
   import Social from '$lib/components/Social.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {fly} from 'svelte/transition'
   import {onMount} from 'svelte'

   export let user
   export let bg, types, mechanics, categories
   export let contents
   const BGID = bg.TBG_ID
   const roles = [
      {name: 'Designer', prefix: 'Designer', url:'designer'},
      {name: 'Artist', prefix: 'Artist', url:'artist'},
      {name: 'Graphic Designer', prefix: 'Graphicdesigner', url:'graphicdesigner'},
      {name: 'Playtester', prefix: 'Playtester', url:'playtester'},
      {name: 'Rulebook Editor', prefix: 'Rulebookeditor', url:'rulebookeditor'},
   ]

   let promiseBasicInfo, promiseEvents, promiseComments
   let filteredContents = contents

   onMount(async ()=>{
      promiseBasicInfo = await getCreatorInfo(BGID)
      promiseEvents = await getEvents(BGID) // to be added
   })

   let favorite: boolean = false // to be fetched from user
   let owned: boolean = false
   $: numFavorites = 9 + (favorite?1:0)

   let contentMediaFilter = [true, false, false, false, false]
   let contentMediaTitle = ['all', 'article', 'video', 'podcast','file']
   let contentTypeFilter = [true, false, false, false, false]
   let contentTypeTitle = ['all', 'preview', 'review', 'how2play','playthrough']
   function contentMediaFilterChange(option){
      contentMediaFilter = contentMediaFilter.map((_, idx)=>idx === option)
      if(option == 0)
         filteredContents = contents
      else
         filteredContents = contents.filter((c)=>c.Content_media === contentMediaTitle[option])
      filteredContents = filteredContents
   }
   function contentTypeFilterChange(option){
      contentTypeFilter = contentTypeFilter.map((_, idx)=>idx === option)
      if(option == 0)
         filteredContents = contents
      else
         filteredContents = contents.filter((c)=>c.Content_type === contentTypeTitle[option])
      filteredContents = filteredContents
   }
</script>

<Seo title="Boardgame"/>

<!--Cover image-->
<div class="w-full h-36">
   <img src="{getImageURL('boardgame', bg.TBG_picture_cover)}" class="object-cover w-full h-60" alt="cover" 
      on:error|once={(ev)=>ev.target.src = getDefaultImageURL('boardgame')}
   >
</div>

<div class="flex flex-row text-left gap-6">
   <!-- First column-->
   <div class="flex flex-col gap-4">
      <div class="mx-auto">
         <img src="{getImageURL('boardgame', bg.TBG_picture)}" alt="cover of {bg.TBG_name}" class="hover:scale-110 w-60 aspect-auto duration-300"
            on:error|once={(ev)=>ev.target.src = getDefaultImageURL('boardgame')}
         />
      </div>
      {#await promiseBasicInfo}
         <Spinner/>
      {:then res}
         {#if res}
            <!--iterate through roles (designer, artist, graphicdesigner, playtester)-->
            {#each roles as role}
               <div>
                  <h3>{role.name}</h3>
                  {#each res[role.url] as d} 
                     <div class="flex flex-row items-center gap-2">
                        <div class="avatar">
                           <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
                           <img src="{getImageURL('person', d.Person_picture)}" alt="avatar" class="object-contain"
                              on:error|once={(ev)=>ev.target.src = getDefaultImageURL('person')}
                           />
                           </div>
                        </div>
                        <a href="/person/{d.Person_ID}/{d.Person_slug}?role={role.url}">{d.Person_name}</a>
                     </div>
                  {:else} 
                     -
                  {/each}
               </div>
            {/each}
            <div>
               <h3>Publisher</h3>
               {#each res.publisher as p} 
               <div class="flex flex-row items-center gap-2">
                  <div class="avatar">
                     <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
                     <img src="{getImageURL('publisher', p.Publisher_picture)}" alt="avatar" class="object-contain"
                        on:error|once={(ev)=>ev.target.src = getDefaultImageURL('publisher')}
                     />
                     </div>
                  </div>
                  <a href="/publisher/{p.Publisher_ID}">{p.Publisher_name}</a>
               </div>
               {:else} 
                  -
               {/each}
            </div>
         {/if}
      {:catch}
         <p>Server unavailable. Please try again later.</p>
      {/await}
   </div>
   <!-- Second column -->
   <div class="flex flex-col justify-center gap-4 pt-10 w-1/2">
      <div class="flex flex-row items-center gap-2">
         <Social url="https://thaibg.herokuapp.com/boardgame/{bg.TBG_ID}" title="{bg.TBG_name}"/>
         
         {#if bg.TBG_link} 
            <div class="tooltip" data-tip="external link">
               <div class="btn btn-square">
                  <a href="{bg.TBG_link}" target="_blank">
                     <LinkIcon size="2x"/>
                  </a>
               </div>
            </div>
         {/if}
         {#if user && !user.guest}
            <div class="tooltip" data-tip="edit this page">
               <div class="btn btn-square btn-secondary">
                  <EditIcon size="2x"/>
               </div>
            </div>
         {/if}
      </div>
      <div class="flex flex-row justify-between items-center">
         <div>
            <h1>{bg.TBG_name || bg.TBG_name_th}</h1>
            {#if (bg.TBG_name && bg.TBG_name_th)} 
               <h2>({bg.TBG_name_th})</h2> 
            {/if}
            <h2>{bg.TBG_released? '(' + bg.TBG_released + ')' : ''}</h2>
         </div>
         <div>
            <div class="tooltip" data-tip="{owned? 'Remove owned':'Mark as owned'}">
               <label>
                  <input type="checkbox" bind:checked={owned} class="hidden">
                  <PackageIcon size="40" class="{owned?"text-blue-300":""}"/>
                  {#key owned}
                     <div in:fly>{owned? '^_^' : '-'}</div>
                  {/key}
               </label>
            </div>
            <div class="tooltip" data-tip="{favorite? 'Unlike':'Like'}">
               <label>
                  <input type="checkbox" bind:checked={favorite} class="hidden">
                  <StarIcon size="40" class="{favorite?"text-yellow-300":""}"/>
                  {#key numFavorites}
                     <div in:fly>{numFavorites}</div>
                  {/key}
               </label>
            </div>
         </div>
      </div>

      <div class="flex flex-row gap-4">
         <div class="tooltip flex items-center flex-row gap-2" data-tip="Age">
            <UserIcon size="20" class="text-accent"/>
            <p>{bg.TBG_age? bg.TBG_age + '+' : '-'} </p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="Number of players">
            <UsersIcon size="20" class="text-accent"/>
            <p>{bg.TBG_player_min || ''}{bg.TBG_player_max? ' - ' + bg.TBG_player_max:''} player{bg.TBG_player_max > 1? 's':''}</p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="Playtime">
            <ClockIcon size="20" class="text-accent"/>  
            <p>{bg.TBG_playtime_min || ''}{bg.TBG_playtime_max? ' - ' + bg.TBG_playtime_max : ''} minutes</p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="Weight">
            <FeatherIcon size="20" class="text-accent"/>
            <p>{bg.TBG_weight || '-'}</p>
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
            <div class="btn btn-xs btn-outline">Media</div>
            {#each contentMediaFilter as _,idx}
               <div 
                  class="btn btn-xs" 
                  class:btn-active={contentMediaFilter[idx]}
                  on:click={()=>contentMediaFilterChange(idx)}
                  >
                  {contentMediaTitle[idx]}
                  </div
               >
            {/each}
         </div>
         <div class="btn-group">
            <div class="btn btn-xs btn-outline">Type</div>
            {#each contentTypeFilter as _,idx}
            <div 
               class="btn btn-xs btn-info" 
               class:btn-active={contentTypeFilter[idx]}
               on:click={()=>contentTypeFilterChange(idx)}
               >
               {contentTypeTitle[idx]}
               </div
            >
            {/each}
         </div>
         <br> 
         {#if contents}
            {#each filteredContents as content}
               <ContentCard {content}/>
            {:else}
               N/A
            {/each}
         {:else}
            -
         {/if}
      </div>
      <div class="divider"></div>
      <CommentSection type='boardgame' ID={BGID}/>
   </div>
   <!-- third column-->
   <div class="flex flex-col gap-4 pt-28">
      <div>
         <h3>Honor</h3>
      </div>
      <div class="divider"></div>
      <div>
         <h3>Event</h3>
      </div>
      <div class="divider"></div>
      <div>
         <h3>Playable at</h3>
      </div>
      <div>
         <h3>Buy at</h3>
      </div>
   </div>
</div>