<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session

       const {data, error} = await from('Content').select('*').eq('Content_ID', params.id)
       const content = data[0]
       const {data: bg, error: error2} = await from('Boardgame')
         .select('*')
         .eq('TBG_ID', content.TBG_ID)
      const {data: c, error: error3} = await from('Creator')
         .select('*, Creator_Relation!inner(*)')
         .eq('Creator_Relation.Content_ID', content.Content_ID)

      let creators = c.map((c)=>({
         id: c.Creator_ID,
         picture: c.Creator_picture,
         name: c.Creator_name,
         type: 'creator',
         slug: c.Creator_slug
      }))

       if(error || error2 || error3) 
         return {status:404}

       return {
           props: {
               user,
               bg: bg[0],
               content, creators
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   import PersonCard from '$lib/components/PersonCard.svelte'

   export let user, content, bg, creators
   console.log(bg)
   content.Content_picture = DIR_IMAGE + '/event/' + (content.Content_picture || URL_BLANK_IMAGE)
</script>

<Seo title="Event"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !content}
         Invalid content ID!
      {:else}
      
         <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
            <img src="{content.Content_picture}" alt="image of {content.Content_name}" class="w-72 mask mask-hexagon-2"/>
            <div>
               <h1>{content.Content_name}</h1>
               <h2>{content.Content_name_th? "(" + content.Content_name_th + ")": ""}</h2>
               <ul>
                  <li>Link: 
                     {#if content.Content_link}
                        <a href="{content.Content_link}" target="_blank">{content.Content_link}</a>
                     {:else}
                        N/A
                     {/if}
                  </li>
               </ul>
            </div>
         </div>
         <!-- <div>{likes.length}</div> -->
         <div>
            <h2>Description</h2>
            <p>{@html content.Content_description || 'N/A'}</p>
         </div>
         <div class="divider"></div>
         <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <BoardgameCard {bg}/>
         </div>
         <h2>Created by</h2>
         <div>
            {#each creators as c}
               <PersonCard {...c}/>
            {/each}
         </div>
      {/if}
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>