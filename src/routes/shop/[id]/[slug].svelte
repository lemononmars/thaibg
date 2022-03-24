<script lang="ts" context="module">
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export async function load({ params, fetch }) {
       const res = await fetch(`/api/shop/${params.id}`)
       if(!res.ok) return{status:404, message:'cannot find any shop with that ID'}

       const data = await res.json()
       return {
           props: {
               shopData: data
           }
       };
   }

   export async function getBoardgames(id){
      const res = await fetch(`/api/shop/${id}/boardgame`)
      if(!res.ok) return {status:404, message:'cannot find any boardgame associated with that shop'}
      let data = await res.json()
      return data
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import BoardgameCard from '$lib/components/BoardgameCard.svelte'
   import Social from '$lib/components/Social.svelte'
   import {CheckCircleIcon, LinkIcon, SlashIcon} from 'svelte-feather-icons'
   import {onMount} from 'svelte'
   import type {Shop} from '$lib/datatypes'
   import ShopStatusBadge from '$lib/components/ShopStatusBadge.svelte'

   export let shopData: Shop
   let promiseBoardgames: Promise<Shop[]>
   onMount(async ()=>{
      promiseBoardgames = getBoardgames(shopData.Shop_ID)
   })
   
</script>

<Seo title="Shop"/>
<div class="flex flex-row text-left gap-6 mt-4">
   <!-- first column-->
   <div class="flex flex-col w-1/4 gap-2">
      <div class="mx-auto">
         <img src="{getImageURL('shop',shopData.Shop_picture)}" alt="image of {shopData.Shop_name}" class="w-72"
            on:error|once={(ev)=>ev.target.src = getDefaultImageURL('shop')}
         />
      </div>
      
      <h1>{shopData.Shop_name}</h1>
      <h2>Status</h2>
      <ShopStatusBadge status={shopData.Shop_status} showText={true}/>
      <h2>Type</h2>
      <div class="flex flex-row items-center gap-2">
         {#if shopData.Shop_cafe}
            <CheckCircleIcon size='1x' class="text-success"/>
         {:else}
            <SlashIcon size='1x' class="text-error"/>
         {/if}
         <p>Cafe</p>
         <div class="w-2"></div>
         {#if shopData.Shop_online}
            <CheckCircleIcon size='1x' class="text-success"/>
         {:else}
            <SlashIcon size='1x' class="text-error"/>
         {/if}
         <p>Online</p>
      </div>
      <h2>Location</h2>
      <p>{shopData.Shop_location || ''}</p>
      <p>{shopData.Shop_province || 'N/A'}</p>
      <h2>Since</h2>
      <p>{shopData.Shop_start_year || 'N/A'}</p>
      <h2>Size</h2>
      <p>{shopData.Shop_capacity || 'N/A'}</p>
      <h2>Description</h2>
      <p class="break-words">{@html shopData.Shop_description || 'N/A'}</p>

      <div class="divider"></div>

      <h2>Connect</h2>
      <div class="flex flex-row items-center gap-2">
         {#if shopData.Shop_link} 
            <Social url="{shopData.Shop_link}" title="{shopData.Shop_name}"/>
            <div class="tooltip" data-tip="external link">
               <div class="btn btn-square">
                  <a href="{shopData.Shop_link}" target="_blank">
                     <LinkIcon size="2x"/>
                  </a>
               </div>
            </div>
         {/if}
      </div>
   </div>
   <!-- second column-->
   <div class="flex flex-col gap-4">
      {#await promiseBoardgames}
         <Spinner/>
      {:then boardgames}
         {#if boardgames}
            <h2>Board games available to play</h2>
            <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
               {#each boardgames as bg}
                  {#if bg.Shop_Relation[0].Shop_TBG_playable}
                     <BoardgameCard {bg}/>
                  {/if}
               {:else}
                  N/A
               {/each}
            </div>
            <h2>Board games available to buy or get</h2>
            <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
               {#each boardgames as bg}
                  {#if bg.Shop_Relation[0].Shop_TBG_obtainable}
                     <BoardgameCard {bg}/>
                  {/if}
               {:else}
                  N/A
               {/each}
            </div>
         {/if}
      {/await}
   </div>
</div>