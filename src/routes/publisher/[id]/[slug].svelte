<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const res = await fetch(`/api/publisher/${params.id}`)
       if(!res.ok) return {status:400}

       const data = await res.json()
       return {
           props: {
               user,
               publisherData: data || null
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {onMount} from 'svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export let user, publisherData
   let boardgameData
   onMount(async ()=>{
      const {data, error} = await from('Boardgame')
         .select('*, Publisher_Relation!inner(*)')
         .eq('Publisher_Relation.Publisher_ID', publisherData.Publisher_ID)
         
      if(error) throw error
      boardgameData = data
      publisherData.Publisher_picture =  '/publisher/' + (publisherData.Publisher_picture )
   })
   
</script>

<Seo title="Publisher"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
      {#if !publisherData}
         Invalid Publisher ID!
      {:else}
         {#if boardgameData}
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{publisherData.Publisher_picture}" alt="image of {publisherData.Publisher_name}" class="w-72" 
                  on:error|once={(ev)=>ev.target.src = getDefaultImageURL('publisher')}
               />
               <div>
                  <h1>{publisherData.Publisher_name}</h1>
                  <h2>{publisherData.Publisher_name_th? "(" + publisherData.Publisher_name_th + ")": ""}</h2>
                  <ul>
                     <li>Official link: 
                        {#if publisherData.Publisher_link}
                           <a href="{publisherData.Publisher_link}" target="_blank">{publisherData.Publisher_link}</a>
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
               <p>{@html publisherData.Publisher_description || 'N/A'}</p>
            </div>
            <div class="divider"></div>
            <h2>Publications</h2>
            <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
               {#each boardgameData as bg}
                  <BoardgameCard {bg}/>
               {:else}
                  N/A
               {/each}
            </div>
         {:else}
            <Spinner/>
         {/if}
      {/if}
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>