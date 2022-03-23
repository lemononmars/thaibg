<script lang="ts" context="module">
   import {getImageURL, getDefaultImageURL, getVarPrefix} from '$lib/supabase'
   import {personDeveloperRoles, ContentTypeArray, ContentMediaArray} from '$lib/datatypes'
   import type {Content, Honor, Boardgame, Shop, Event} from '$lib/datatypes'
   import {WEBSITE_URL} from '$lib/constants'

   export async function load({ params, fetch }) {
      let bg: Boardgame
      await fetch(`/api/boardgame/${params.id}`)
         .then(res => res.json())
         .then(data => bg = data)
         .catch(error => {return {status:400, message: error}})

      const basicTypeName = ['type', 'mechanics', 'category', 'honor']
      let basicData = basicTypeName.map((t)=> ({t:[]}))
     
      for(const type of basicTypeName)
         await fetch(`/api/boardgame/${params.id}/${type}`)
            .then(res => res.json())
            .then(data => basicData[type] = data)

      return {
         props: {
            bg, ...basicData
         }
      };
   }

   export async function getCreatorInfo(BGID) {
      let data = []
      personDeveloperRoles.forEach((p)=> data[p] = [])
      for(const role of Object.keys(data)) {
         const res = await fetch(`/api/boardgame/${BGID}/${role}`)
         if(res.ok) {
            const people = await res.json()
            // get the person data from each corresponding role
            // ex. /api/playtester/2/person
            for(const p of people){
               await fetch(`/api/${role}/${p[getVarPrefix(role)+'_ID']}/person`)
                  .then(res => res.json())
                  .then(d => data[role] = [...data[role], d[0]])
            }
         }
      }
      await fetch(`/api/boardgame/${BGID}/publisher`)
         .then(res => res.json())
         .then(d => data['publisher'] = d)
         .catch(error => data['publisher'] = [])
      return data
   }

   export async function getContents(BGID: number){
      const res = await fetch(`/api/boardgame/${BGID}/content`)
      if(!res.ok) return []
      
      const data = await res.json()
      return data
   }

   export async function getEvents(BGID: number){
      const res = await fetch(`/api/boardgame/${BGID}/event`)
      if(!res.ok) return []
      
      const data = await res.json()
      return data
   }

   export async function getShops(BGID: number){
      const res = await fetch(`/api/boardgame/${BGID}/shop`)
      if(!res.ok) return []
      
      const data = await res.json()
      return data
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import ContentCard from '$lib/components/ContentCard.svelte'
   import PlainLink from '$lib/components/PlainLink.svelte'
   import CommentSection from '$lib/components/CommentSection.svelte'
   import {StarIcon, UserIcon, UsersIcon, ClockIcon, FeatherIcon, EditIcon, LinkIcon, PackageIcon} from 'svelte-feather-icons'
   import Social from '$lib/components/Social.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {fly} from 'svelte/transition'
   import {onMount} from 'svelte'
   import {user} from '$lib/user'
   import {_} from 'svelte-i18n'

   export let bg: Boardgame, type, mechanics, category, honor: Honor[] // these are singulars (not plurals) so that we can access the table easily
   export let content: Content[] = []
   const BGID = bg.TBG_ID

   let promiseCreatorInfo: Promise<any>
   let promiseEvents: Promise<Event[]>
   let promiseShops: Promise<Shop[]>
   let promiseContents: Promise<Content[]>
   let filteredContents = content
   let isLoadingContents = true

   onMount(async ()=>{
      promiseCreatorInfo = getCreatorInfo(BGID)
      promiseShops = getShops(BGID)
      promiseEvents = getEvents(BGID)
      promiseContents = getContents(BGID)
      // resolve promise both here and on the page
      Promise.resolve(promiseContents)
         .then((data)=> {
            content = data
            filteredContents = data
            console.log(data, 'hye')
            isLoadingContents = false
         })
   })

   let favorite: boolean = false // to be fetched from user
   let owned: boolean = false
   $: numFavorites = 9 + (favorite?1:0)

   const optionContentMediaTitle = ['all', ...ContentMediaArray]
   const optionContentTypeTitle = ['all', ...ContentTypeArray]
   let optionContentMedia: number = 0
   let optionContentType: number = 0

   // TODO: set a limit on how many contents to be displayed
   $: filteredContents = content.filter((c: Content)=>
      (
         (optionContentMedia == 0) || (optionContentMediaTitle[optionContentMedia] === c.Content_media)
      )
      &&
      (
         (optionContentType == 0) || (optionContentTypeTitle[optionContentType] === c.Content_type)
      )
   )
</script>

<Seo title="Boardgame"/>

<!--Cover image-->
<div class="w-full h-36">
   <img src="{getImageURL('boardgame', bg.TBG_picture_cover)}" class="object-cover w-full h-60" alt="cover" 
      on:error|once={(ev)=>ev.target.src = getDefaultImageURL('boardgame')}
   >
</div>

<div class="flex flex-col lg:flex-row text-left gap-6 mx-4 lg:mx-auto">
   <!-- First column-->
   <div class="flex flex-col gap-4 lg:basis-1/4 order-2 lg:order-1">
      <div class="mx-auto">
         <img src="{getImageURL('boardgame', bg.TBG_picture)}" alt="cover of {bg.TBG_name}" class="hover:scale-110 w-60 aspect-auto duration-300"
            on:error|once={(ev)=>ev.target.src = getDefaultImageURL('boardgame')}
         />
      </div>
      {#await promiseCreatorInfo}
         <Spinner/>
      {:then res}
         {#if res}
            <!--iterate through personRoles (designer, artist, graphicdesigner, playtester)-->
            {#each personDeveloperRoles as role}
               <div>
                  <h3>{$_(role)}</h3>
                  {#each res[role] as d} 
                     <PlainLink type={role} object={d}/>
                  {:else} 
                     {$_('incomplete')}
                  {/each}
               </div>
            {/each}
            <div>
               <h3>{$_('publisher')}</h3>
               {#each res.publisher as p} 
               <div class="flex flex-row items-center gap-2">
                  <PlainLink type="publisher" object={p}/>
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
   <div class="flex flex-col justify-center gap-4 pt-10 lg:basis-1/2 order-1 lg:order-2 break-words">
      <div class="flex flex-row items-center gap-2">
         <Social url="{WEBSITE_URL}/{bg.TBG_ID}" title="{bg.TBG_name}"/>
         
         {#if bg.TBG_link} 
            <div class="tooltip" data-tip="external link">
               <div class="btn btn-square">
                  <a href="{bg.TBG_link}" target="_blank">
                     <LinkIcon size="2x"/>
                  </a>
               </div>
            </div>
         {/if}
         {#if user}
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

      <div class="flex flex-row gap-4 flex-wrap">
         <div class="tooltip flex items-center flex-row gap-2" data-tip="{$_('age')}">
            <UserIcon size="20" class="text-accent"/>
            <p>{bg.TBG_age? bg.TBG_age + '+' : $_('incomplete')} </p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="{$_('numPlayers')}">
            <UsersIcon size="20" class="text-accent"/>
            <p>{bg.TBG_player_min || ''}{bg.TBG_player_max? ' - ' + bg.TBG_player_max:''} player{bg.TBG_player_max > 1? 's':''}</p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="{$_('playtime')}">
            <ClockIcon size="20" class="text-accent"/>  
            <p>{bg.TBG_playtime_min || ''}{bg.TBG_playtime_max? ' - ' + bg.TBG_playtime_max : ''} {$_('minutes')}</p>
         </div>
         <div class="tooltip flex items-center flex-row gap-2" data-tip="{$_('weight')}">
            <FeatherIcon size="20" class="text-accent"/>
            <p>{bg.TBG_weight || $_('incomplete')}</p>
         </div>
      </div>
      <div>
         <h3>{$_('description._')}</h3>
         {bg.TBG_description || $_('description.not_found')}
      </div>
      <div class="divider"></div>
      <div>
         <h3>{$_('type')}</h3>
         <div class="flex flex-row gap-2 items-center flex-wrap">
            {#each type as t} 
               <div class="badge badge-lg"><a href="/type/{t.Type_ID}">{t.Type_name}</a></div>
            {:else} 
               {$_('incomplete')}
            {/each}
         </div>
         <h3>{$_('mechanics')}</h3>
         <div class="flex flex-row gap-2 items-center flex-wrap">
            {#each mechanics as m} 
               <div class="badge badge-lg"><a href="/mechanics/{m.Mech_ID}">{m.Mech_name}</a></div>
            {:else} 
               {$_('incomplete')}
            {/each}
         </div>
         <h3>{$_('category')}</h3>
         <div class="flex flex-row gap-2 items-center flex-wrap">
            {#each category as c} 
               <div class="badge badge-lg"><a href="/category/{c.Category_ID}">{c.Category_name}</a></div>
            {:else} 
               {$_('incomplete')}
            {/each}
         </div>
      </div>
      <div class="divider"/>
      <div>
         <h2>{$_('content._')}</h2> 
         <div class='flex flex-row items-center gap-2'>
            <h3>{$_('content.type._')}</h3>
            <div class="btn-group">
               {#each optionContentTypeTitle as title,idx}
                  <div 
                     class="btn btn-xs" 
                     class:btn-active={optionContentType == idx}
                     on:click={()=>optionContentType = idx}
                  >
                     {$_('content.type.' + title)}
                  </div>
               {/each}
            </div>
         </div>
         <div class='flex flex-row items-center gap-2'>
            <h3>{$_('content.media._')}</h3>
            <div class="btn-group">
               {#each optionContentMediaTitle as title,idx}
                  <div 
                     class="btn btn-xs" 
                     class:btn-active={optionContentMedia == idx}
                     on:click={()=>optionContentMedia = idx}
                     >
                     {$_('content.media.' + title)}
                     </div
                  >
               {/each}
            </div>
         </div>
         {#if isLoadingContents}
            <Spinner/>
         {:else}
            
            {#if content}
               <div class="grid grid-cols-2 gap-2">
                  {#each filteredContents as c (c.Content_ID)}
                     <ContentCard content={c}/>
                  {:else}
                     {$_('content.not_found')}
                  {/each}
               </div>
            {:else}
               $_('incomplete')
            {/if}
         {/if}
      </div>
      <div class="divider"></div>
      <CommentSection type='boardgame' ID={BGID}/>
   </div>
   <!-- third column-->
   <div class="flex flex-col gap-4 pt-28 order-3 lg:basis-1/4">
      <div>
         <h2>{$_('honor')}</h2>
         {#each honor as h}
            <PlainLink type="honor" object={h} comment={h.Honor_Relation[0].Honor_position + ' ' + (h.Honor_Relation[0].Honor_category || '')}/>
         {:else}
            -
         {/each}
      </div>
      <div class="divider"></div>
      <div>
         {#await promiseEvents}
            <Spinner/>
         {:then events}
            {#if events}
               <h2>{$_('event')}</h2>
               {#each events as e}
                  <PlainLink type="event" object={e}/>
               {:else}
                  -
               {/each}
            {/if}
         {/await}
      </div>
      <div class="divider"></div>
      {#await promiseShops}
         <Spinner/>
      {:then shops}
         {#if shops}
            <div>
               <h2>{$_('page.boardgame.playable')}</h2>
               {#each shops as shop}
                  {#if shop.Shop_Relation[0]?.Shop_TBG_playable}
                     <PlainLink type="shop" object={shop}/>
                  {/if}
               {:else}
                  {$_('incomplete')}
               {/each}
            </div>
            <div>
               <h2>{$_('page.boardgame.obtainable')}</h2>
               {#each shops as shop}
                  {#if shop.Shop_Relation[0]?.Shop_TBG_obtainable}
                     <PlainLink type="shop" object={shop}/>
                  {/if}
               {:else}
                  {$_('incomplete')}
               {/each}
            </div>
         {/if}
      {/await}
   </div>
</div>