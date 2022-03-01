<script lang="ts" context="module">
   import {from} from '$lib/supabase'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'
   
   export async function load({ session, params, url }) {
       const { user } = session
       const {data, error} = await from('Person').select('*').eq('Person_ID', params.id)
       if(error)
         return {
            status:404
         }

       return {
           props: {
               user,
               person: data[0] || null,
               role: url.searchParams.get('role'),
           }
       };
   }

   export async function getRoleContent(role: string, person){
      let res, data, contents 
      let returnedData
      // TODO: figure out how to insert literal string r into from()
      switch(role){
         case "Designer": 
            res = await from('Designer')
               .select('*')
               .eq('Designer_ID', person.Designer_ID)

            if(res.error)  return {status: 404}

            data = res.data[0]
            res = await from('Boardgame')
               .select('*,Designer_Relation!inner(*)')
               .eq('Designer_Relation.Designer_ID', person.Designer_ID)

            if(res.error)  return {status: 404}
            contents = res.data
            break;

         case "Creator":
         res = await from('Creator')
               .select('*')
               .eq('Creator_ID', person.Creator_ID)

            if(res.error)  return {status: 404}

            data = res.data[0]
            res = await from('Content')
               .select('*,Creator_Relation!inner(*)')
               .eq('Creator_Relation.Creator_ID', person.Creator_ID)

            if(res.error)  return {status: 404}
            contents = res.data
            break;

         case "Graphicdesigner":
         res = await from('Graphicdesigner')
               .select('*')
               .eq('Graphicdesigner_ID', person.Graphicdesigner_ID)

            if(res.error)  return {status: 404}

            data = res.data[0]
            res = await from('Boardgame')
               .select('*,Graphicdesigner_Relation!inner(*)')
               .eq('Graphicdesigner_Relation.Graphicdesigner_ID', person.Graphicdesigner_ID)

            if(res.error)  return {status: 404}
            contents = res.data
            break;

         case "Artist":
            res = await from('Artist')
               .select('*')
               .eq('Artist_ID', person.Artist_ID)

            if(res.error)  return {status: 404}

            data = res.data[0]
            res = await from('Boardgame')
               .select('*,Artist_Relation!inner(*)')
               .eq('Artist_Relation.Artist_ID', person.Artist_ID)

            if(res.error)  return {status: 404}
            contents = res.data
            break;
         default: 
            role='Person'
            break;
      }

      returnedData = {
         description: data[role + '_description'],
         id: data[role + '_ID'],
         name: data[role + '_name'],
         team: data[role + '_team'],
         slug: data[role + '_slug'],
         role,
         contents
      }
      return returnedData
   }
   
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import ContentCard from '$lib/components/ContentCard.svelte'
   import ContactLinks from '$lib/components/ContactLinks.svelte'

   export let user, person, role
   const roleTitles = ['Artist', 'Creator', 'Designer', 'Graphicdesigner']
   let activeroleTitles = roleTitles.map((r)=>!!person[r + '_ID'])
   let activeTab
   if(role) 
      activeTab = roleTitles.indexOf(role) // response to url ?role=Designer
   else if (activeroleTitles.indexOf(true)) 
      activeTab = activeroleTitles.indexOf(true) // first non-empty role
   else 
      activeTab = 0 // if all else fails, just use first index
      
   let rolePromise

   onMount(async ()=>{
      rolePromise = await getRoleContent(roleTitles[activeTab], person) // initial loader
   })
   
   function changeTab(idx: number) {
      activeTab = idx
      if(activeroleTitles[activeTab])
         rolePromise = getRoleContent(roleTitles[activeTab], person)
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

   <div class="flex flex-col w-2/3 text-left m-4 justify-center">
      <div class="tabs w-full m-10 mx-auto flex-grow">
         {#each roleTitles as r, idx}
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="tab tab-lg tab-lifted text-xl" 
               class:text-success={!!activeroleTitles[idx]} 
               class:tab-active={idx == activeTab}
               class:text-bold={idx == activeTab}
               on:click={()=>changeTab(idx)}
            >
               {r}
            </a> 
         {/each}
      </div>
      <div class="flex flex-col justify-center">
         {#await rolePromise}
            <div>
               <Spinner/>
            </div>
         {:then res}
            {#if res}
               {#if !activeroleTitles[activeTab]}
                  <p>This person doesn't have {roleTitles[activeTab]} role. Add one?</p>
               {:else}
                  <div>
                     <h2>{roleTitles[activeTab]} Name</h2>
                     <p>{res.name}</p>
                     <h2>{roleTitles[activeTab]} Description</h2>
                     <p>{@html res.description || '-'}</p>
                     <h2>{roleTitles[activeTab]} Team</h2>
                     <p>{res.team || '-'}</p>
                  </div>

                  <div class="divider"></div>
                  {#if roleTitles[activeTab] === 'Creator'}
                     <h2>Contents creator of</h2>
                     <div class="w-full text-center mb-4 grid grid-cols-2 gap-4">
                        {#each res.contents as content}
                           <ContentCard {content}/>
                        {:else}
                           -
                        {/each}
                     </div>
                  {:else}
                     <h2>{res.role} of</h2>
                     <div class="w-full text-center mb-4 grid grid-cols-2 gap-4">
                        {#each res.contents as bg}
                           <BoardgameCard {bg}/>
                        {:else}
                           -
                        {/each}
                     </div>
                  {/if}
               {/if}
            {/if}
         {:catch}
            <p>Server is unavailable. Try again later.</p>
         {/await}
      </div>
   </div>
</div>