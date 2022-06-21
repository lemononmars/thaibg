<script lang="ts" context="module">
   export async function load({ fetch }) {
		const res = await fetch(`/api/shop`);
		if (!res.ok) {
			return { 
				props: {
               shops: []
            }
			};
      }

		const data = await res.json();
      // only select shop with non-null location
      const shops = data.filter((d:Shop)=>d.Shop_location?.location)
      const provinces = [... new Set(shops.map((s:Shop)=>s.Shop_province))]
		return {
			props: {
				shops,
            provinces
			}
		};
	}
</script>

<script lang="ts">
   import type { Shop } from "$lib/datatypes";
   import GoogleMapDisplay from "$lib/components/GoogleMapDisplay.svelte";
import Picture from "$lib/components/Picture.svelte";

   export let 
      shops: Shop[], 
      provinces: string[]

   let provinceIndex: number = -1
   let currentShopID: number = -1
   $: shopsFiltered = (provinceIndex === -1) ? 
      shops: 
      shops.filter(s=>s.Shop_province === provinces[provinceIndex])

   $: currentShop = shops.filter(s=>s.Shop_ID === currentShopID)[0]
</script>

<div class="h-screen w-screen left-0 flex flex-col lg:flex-row justify-between">
   <div class="w-full lg:w-1/4 flex flex-col gap-2">
      <h2>1) Select a province</h2>
      <select class="select select-bordered" bind:value={provinceIndex}>
         <option value={-1}>All</option>
         {#each provinces as p, idx}
            <option value={idx}>{p}</option>
         {/each}
      </select>
      {#if shopsFiltered.length > 0}
         <h2>2) Select shop</h2>
         <div class="flex flex-col overflow-y-scroll">
            {#each shopsFiltered as s}
               <div class="btn" on:click={()=>currentShopID = s.Shop_ID}>
                  {s.Shop_name}
               </div>
            {/each}
         </div>
      {:else}
         No shop in that province
      {/if}
     
   </div>
   <div class="w-full lg:w-1/2">
      <GoogleMapDisplay {shops} bind:currentShopID/>
   </div>
   <div class="w-full lg:w-1/4 text-left p-2">
      {#if currentShop}
         <Picture type={'shop'} picture={currentShop.Shop_picture} mask={'square'} height={60}/>
         <h3>Name</h3>
         <p>{currentShop.Shop_name}</p>
         <h3>Description</h3>
         <p class="whitespace-pre-wrap">{currentShop.Shop_description}</p>
         <h3>Type</h3>
         {#each currentShop.Shop_type as t}
            <div class="badge text-xs">{t}</div>
         {/each}
         <h3>Status</h3>
         <p>{currentShop.Shop_status}</p>
      {/if}
   </div>
</div>