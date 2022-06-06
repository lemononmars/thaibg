<script lang="ts" context="module">
   export async function load({ fetch }) {
		const res = await fetch(`/api/shop?select=ID,name,location`);
		if (!res.ok) 
			return { 
				props: {
               shops: []
            }
			};

		const data = await res.json();
		return {
			props: {
				shops: data.filter(d=>d.Shop_location)
			}
		};
	}
</script>

<script lang="ts">
   import type { ShopLocation } from "$lib/datatypes";
   import GoogleMapDisplay from "$lib/components/GoogleMapDisplay.svelte";

   interface ShopMinimal {
      Shop_name: string,
      Shop_ID: number,
      Shop_location: ShopLocation
   }

   export let shops: ShopMinimal[]
   const names = shops.map(s=>s.Shop_name)
   const ids = shops.map(s=>s.Shop_ID)
   const places = shops.map(s=>s.Shop_location)

   let placeIndex: number = -1
</script>

<div class="h-screen right-0 flex flex-row justify-between gap-4">
   <div class="w-1/4 flex flex-col gap-2">
      {#if shops.length > 0}
         <h2>Select shop to zoom!</h2>
         {#each names as name, idx}
            <div class="btn" on:click={()=>placeIndex = idx}>{name}</div>
         {/each}
      {:else}
         No shop.....
      {/if}
   </div>
   <div class="w-3/4">
      <GoogleMapDisplay {names} {ids} {places} bind:placeIndex/>
   </div>
</div>