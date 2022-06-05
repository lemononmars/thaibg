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

<div class="absolute h-full w-full flex flex-row">
   {#if shops.length > 0}
      <div class="w-1/4">
         {#each names as name, idx}
            <div class="btn" on:click={()=>placeIndex = idx}>{name}</div>
         {/each}
      </div>
      <GoogleMapDisplay {names} {ids} {places} bind:placeIndex/>
   {:else}
      No shop.....
   {/if}
</div>