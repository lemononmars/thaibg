<script lang="ts" context="module">
   // TODO: delegate some heavy loading to client-side
   import {from, fromBucket} from '$lib/supabase'

   export async function load({ session, params }) {
      const { user } = session
      const {data, error} = await from('Boardgame').select('*').eq('TBG_ID', params.id)
      if(error)
      return {
         status: 404,
      }

      let types, mechanics, categories
      let bg = data[0]
      let BGID = bg.TBG_ID
      let res
     
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
            bg, types, mechanics, categories
         }
      };
   }

   export async function getBasicInfo(BGID) {
      let res = await from('Designer')
         .select('*, Designer_Relation!inner(*)')
         .eq('Designer_Relation.TBG_ID', BGID)
      let designers = res.data
      res = await from('Artist')
         .select('*, Artist_Relation!inner(*)')
         .eq('Artist_Relation.TBG_ID', BGID)
      let artists = res.data
      res = await from('Graphicdesigner')
         .select('*, Graphicdesigner_Relation!inner(*)')
         .eq('Graphicdesigner_Relation.TBG_ID', BGID)
      let graphicdesigners = res.data
      res = await from('Publisher')
         .select('*, Publisher_Relation!inner(*)')
         .eq('Publisher_Relation.TBG_ID', BGID)
      let publishers = res.data
      

      return {designers, artists, publishers, graphicdesigners}
   }

   export async function getContents(BGID) {
      let res = await from('Content')
         .select('*')
         .eq('TBG_ID', BGID)
      return {contents: res.data}
   }

   export async function getEvents(BGID){
      return null
   }

   export async function getComments(BGID){
      const {data, error} = await from('Comment').select('*').eq('TBG_ID', BGID)
      let comments = data
      if(data) {
         for(let c in comments)  {
            // fetch username and profile pic
            const {data: commentData, error} = await from('profiles').select('avatar_url, username').eq('id', data[c].Comment_user_ID)
            const {signedURL, error: error2} = await fromBucket('avatars')
               .createSignedUrl(commentData[0].avatar_url, 30) 
            comments[c]['Comment_avatar_url'] = signedURL
            comments[c]['Comment_username'] = commentData[0].username // add new key-value pair
         }
      }
      return {comments}
   }

// /** @type {import('@sveltejs/kit').RequestHandler} */
//    export async function post({request, params}){
//       const {data, error} = from('Comment')
//          .insert([
//             {
//                TBG_ID: params.id,
//                Comment_text: request.text(),
//                Comment_user_ID: '001'
//             }
//          ])

//       if(error)
//          return {
//             status:400
//          }

//       return {
//          status:200,
//          body:{
//             message: 'posted!',
//             data
//          }
//       }
//    }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import ContentCard from '$lib/components/ContentCard.svelte'
   import {StarIcon, UserIcon, UsersIcon, ClockIcon, FeatherIcon, EditIcon, HomeIcon} from 'svelte-feather-icons'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   import Social from '$lib/components/Social.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {fly} from 'svelte/transition'
   import {onMount} from 'svelte'

   export let user
   export let bg, types, mechanics, categories, graphicdesigners
   const BGID = bg.TBG_ID
   let contents = []
   let promiseBasicInfo, promiseContents, promiseEvents, promiseComments

   onMount(async ()=>{
      promiseBasicInfo = await getBasicInfo(BGID)
      promiseContents = await getContents(BGID)
      contents = promiseContents.data
      promiseEvents = await getEvents(BGID)
      promiseComments = await getComments(BGID)
   })

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
         filteredContents = contents.filter((c)=>c.Content_media === contentTitle[option])
      filteredContents = filteredContents
   }
</script>

<Seo title="Boardgame"/>

<div class="w-full h-36">
   <img src="{DIR_IMAGE + '/boardgame/' + (bg.TBG_picture_cover || URL_BLANK_IMAGE)}" class="object-cover w-full h-60" alt="cover" >
</div>

<div class="flex flex-row text-left gap-6">
   <!-- First column-->
   <div class="flex flex-col gap-4">
      <div class="mx-auto">
         <img src="{DIR_IMAGE + '/boardgame/' + (bg.TBG_picture || URL_BLANK_IMAGE)}" alt="cover of {bg.TBG_name}" class="hover:scale-110 w-60 aspect-auto duration-300"/>
      </div>
      {#await promiseBasicInfo}
         <Spinner/>
      {:then res}
         {#if res}
            <div>
               <h3>Designer</h3>
               {#each res.designers as d} 
                  <div class="flex flex-row items-center gap-2">
                     <div class="avatar">
                        <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
                        <img src="{DIR_IMAGE + '/person/' + (d.Designer_picture || URL_BLANK_IMAGE)}" alt="avatar" class="object-contain">
                        </div>
                     </div>
                     <a href="/person/{d.Designer_ID}">{d.Designer_name}</a>
                  </div>
               {:else} 
                  -
               {/each}
            </div>
            <div>
            <h3>Artist</h3>
               {#each res.artists as a} 
               <div class="flex flex-row items-center gap-2">
                  <div class="avatar">
                     <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
                     <img src="{DIR_IMAGE + '/person/' + (a.Artist_picture || URL_BLANK_IMAGE)}" alt="avatar">
                     </div>
                  </div>
                  <a href="/person/{a.Artist_ID}">{a.Artist_name}</a>
               </div>
               {:else} 
                  -
               {/each}
            </div>
            <div>
            <h3>Graphic Designer</h3>
               {#each res.graphicdesigners as g} 
               <div class="flex flex-row items-center gap-2">
                  <div class="avatar">
                     <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
                     <img src="{DIR_IMAGE + '/person/' + (g.Graphicdesigner_picture || URL_BLANK_IMAGE)}" alt="avatar">
                     </div>
                  </div>
                  <a href="/person/{g.Graphicdesigner_ID}">{g.Graphicdesigner_name}</a>
               </div>
               {:else} 
                  -
               {/each}
            </div>
            <div>
               <h3>Publisher</h3>
               {#each res.publishers as p} 
               <div class="flex flex-row items-center gap-2">
                  <div class="avatar">
                     <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
                     <img src="{DIR_IMAGE + '/publisher/' + (p.Publisher_picture || URL_BLANK_IMAGE)}" alt="avatar">
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
            <h2>{'(' + bg.TBG_released + ')' || ''}</h2>
         </div>
         <div class="tooltip" data-tip="{favorite? 'Unlike':'Like'}">
            <label>
               <input type="checkbox" bind:checked={favorite} class="hidden">
               <div class:text-yellow-300={favorite}><StarIcon size="40" /></div>
               {#key numFavorites}
                  <div in:fly>{numFavorites}</div>
               {/key}
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
      <h3>Comments</h3>
      {#await promiseComments}
         <Spinner/>
      {:then res}
         {#if res}
            {#each res.comments as c}
               <div class="flex flex-row items-center border-2 border-primary p-2 gap-2 rounded-lg">
                  <div class="flex flex-col justify-center gap-1 text-center m-2">
                     <div class="avatar">
                        <div class=" w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                           <img src="{c.Comment_avatar_url}" alt="user avatar">
                        </div>
                     </div>
                     <div class="truncate">
                        {c.Comment_username}
                     </div>
                  </div>
                  <div>
                     {c.Comment_text}
                  </div>
               </div>
            {:else}
               <p>Be the first person to comment!</p>
            {/each}
         {/if}
      {/await}

      {#if user && !user.guest}
         <div class="form-control" method="post">
            <textarea class="textarea h-24 textarea-bordered" placeholder="Add comment"></textarea>
            <div class="btn" type="submit">Submit</div>
         </div>
      {:else}
         <div>
         <a href="/auth">Sign in</a> to comment
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