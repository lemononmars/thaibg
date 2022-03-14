<script lang="ts" context="module">
   import {getVarPrefix} from '$lib/supabase'
   import {personRoles} from '$lib/constants'
   export async function load({ session, params, url, fetch }) {
      const {user} = session
      const res = await fetch(`/api/person/${params.id}`)
      if(!res.ok)
         return {
            status:404
         }
      let person = await res.json()

      return {
         props: {
            user,
            person,
            role: url.searchParams.get('role'),
         }
      };
   }
   
   export async function getRoleContent(role: string, person){
      let data = [], contents = []
      let returnedData
      // grab role information
      const id = person[getVarPrefix(role) + '_ID']
      let res = await fetch(`/api/${role}/${id}`)
      if(!res)  return {status: 404}
      data = await res.json()

      // if the role is content creator, get the list of contents
      // otherwise, get the list of board games
      const contentType = role === 'contentcreator' ? 'content' : 'boardgame'
      res = await fetch(`/api/${role}/${id}/${contentType}`)
      if(!res.ok)  return {status: 404}
      contents = await res.json()

      returnedData = {
         description: data[role + '_description'],
         id: data[role + '_ID'],
         name: data[role + '_name'],
         team: data[role + '_team'],
         slug: data[role + '_slug'],
         contents
      }
      return returnedData
   }
</script>

<script lang="ts">
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import ContentCard from '$lib/components/ContentCard.svelte'
   import ContactLinks from '$lib/components/ContactLinks.svelte'

   // from endpoint [slug].ts
   export let user, person, role 
   const roleUrl = personRoles.map((r)=>r.url)
   let activeroleTitles = personRoles.map((r)=>!!person[r.prefix + '_ID'])
   let activeTab = 0
   if(role) 
      activeTab = roleUrl.indexOf(role) // response to url ?role=Designer
   else if (activeroleTitles.indexOf(true)) 
      activeTab = activeroleTitles.indexOf(true) // first non-empty role
   else 
      activeTab = 0 // if all else fails, just use first index
      
   let rolePromise

   onMount(async ()=>{
      rolePromise = await getRoleContent(roleUrl[activeTab], person) // initial loader
   })
   
   async function changeTab(idx: number) {
      activeTab = idx
      if(activeroleTitles[activeTab])
         rolePromise = await getRoleContent(roleUrl[activeTab], person)
   }
</script>

<Seo title="Person"/>

<div class="w-full h-60">
   <img src="https://picsum.photos/800/600" class="object-cover w-full h-60" alt="cover" >
</div>

<div class="flex flex-row justify-center items-start relative">
   <div class="text-left m-4 flex flex-col -mt-32 w-1/3">
      <div class="avatar">
         <div class="h-72 mask mask-circle hover:scale-110 duration-200">
            <img src="{getImageURL('person', person.Person_picture)}" alt="image of {person.Person_name}"
               on:error|once={(ev)=>ev.target.src = getDefaultImageURL('person')}
            />
         </div>
      </div>
      <div>
         <h1>{person.Person_name}</h1>
         <h2>{person.Person_name_th? "(" + person.Person_name_th + ")": ""}</h2>
         <h3>Bio</h3>
         <p>{@html person.Person_bio || '-'}</p>
         <ContactLinks links={{
            website: person.Person_website,
            facebook: person.Person_facebook,
            twitter: person.Person_twitter,
            email:person.Person_email
         }}/>
      </div>
   </div>

   <div class="flex flex-col w-3/4 text-left m-4 justify-center">
      <div class="tabs w-full m-10 mx-auto flex-grow">
         {#each personRoles as r, idx}
            {#if activeroleTitles[idx]}
               <!-- svelte-ignore a11y-missing-attribute -->
               <a class="tab tab-lg tab-bordered text-xl" 
                  class:text-success={!!activeroleTitles[idx]} 
                  class:tab-active={idx == activeTab}
                  class:text-bold={idx == activeTab}
                  on:click={()=>changeTab(idx)}
               >
                  {r.name}
               </a> 
            {/if}
         {/each}
      </div>
      <div class="flex flex-col justify-center">
         {#await rolePromise}
            <div>
               <Spinner/>
            </div>
         {:then res}
            {#if res}
               <div>
                  <h2>{personRoles[activeTab].name}'s Name</h2>
                  <p>{res.name || '-'}</p>
                  <h2>{personRoles[activeTab].name}'s Description</h2>
                  <p>{@html res.description || '-'}</p>
                  <h2>{personRoles[activeTab].name}'s Team</h2>
                  <p>{res.team || '-'}</p>
               </div>

               <div class="divider"></div>
               {#if roleUrl[activeTab] === 'creator'}
                  <h2>Contents created by this content creator</h2>
                  <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
                     {#each res.contents as content}
                        <ContentCard {content}/>
                     {:else}
                        -
                     {/each}
                  </div>
               {:else}
                  <h2>Board games created by this {personRoles[activeTab].name}</h2>
                  <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
                     {#each res.contents as bg}
                        <BoardgameCard {bg}/>
                     {:else}
                        -
                     {/each}
                  </div>
               {/if}
            {/if}
         {:catch}
            <p>Server is unavailable. Try again later.</p>
         {/await}
      </div>
   </div>
</div>