<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('Shop').select('*').eq('Shop_ID', params.id)
       if(error) {}
       return {
           props: {
               user,
               shopData: data[0] || null
           }
       };
   }

   export async function getPlayableBoardgames(id){
      const {data, error} = await from('Boardgame')
         .select('*, Shop_Relation!inner(*)')
         .eq('Shop_Relation.Shop_ID', id) //add another eq
         
      if(error) throw error
      return data
   }

   export async function getBuyableBoardgames(id){
      const {data, error} = await from('Boardgame')
         .select('*, Shop_Relation!inner(*)')
         .eq('Shop_Relation.Shop_ID', id) //add another eq
         
      if(error) throw error
      return data
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   // import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export let user, shopData
   let boardgameData
   onMount(async ()=>{
      

      shopData.Shop_picture =  '/Shop/' + (shopData.Shop_picture )
   })
   
</script>

<Seo title="Shop"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-left m-4 flex flex-col">
            <div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
               <img src="{getImageURL('shop',shopData.Shop_picture)}" alt="image of {shopData.Shop_name}" class="w-72 mask mask-hexagon-2"
                  on:error|once={(ev)=>ev.target.src = getDefaultImageURL('shop')}
               />
               <div>
                  <h1>{shopData.Shop_name}</h1>
                  <h2>{shopData.Shop_name_th? "(" + shopData.Shop_name_th + ")": ""}</h2>
                  <ul>
                     <li>Location: {shopData.Shop_location || 'N/A'}</li>
                     <li>Official link: 
                        {#if shopData.Shop_link}
                           <a href="{shopData.Shop_link}" target="_blank">{shopData.Shop_link}</a>
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
               <p>{@html shopData.Shop_description || 'N/A'}</p>
            </div>
            <div class="divider"></div>
            <!-- <h2>Board games available</h2> -->
            <!-- <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
               {#each boardgameData as bg}
                  <BoardgameCard {...bg}/>
               {:else}
                  N/A
               {/each}
            </div> -->
         <!-- {:else}
            <Spinner/>
         {/if} -->

      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>