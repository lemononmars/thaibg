<script lang="ts" context="module">
   export async function load({ fetch }) {
		const res = await fetch(`/api/shop?select=ID,name,location,province`);
		if (!res.ok) 
			return { 
				props: {
               shops: []
            }
			};

		const data = await res.json();
      // only select shop with non-null location
      const shops = data.filter(d=>d.Shop_location)
      const provinces = [... new Set(shops.map(s=>s.Shop_province))]
      console.log(provinces)
		return {
			props: {
				shops,
            provinces
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
      Shop_location: ShopLocation,
      Shop_province: string
   }

   export let shops: ShopMinimal[], provinces: string[]
   const names = shops.map(s=>s.Shop_name)
   const ids = shops.map(s=>s.Shop_ID)
   const places = shops.map(s=>s.Shop_location)
   let shopsFiltered = shops

   $: shopsFiltered = (provinceIndex === -1) ? shops : shops.filter(s=>s.Shop_province === provinces[provinceIndex])

   let provinceIndex: number = 0
   let placeIndex: number = -1
</script>

<div class="h-screen right-0 flex flex-row justify-between gap-4">
   <div class="w-1/4 flex flex-col gap-2">
      <h2>1) Select a province</h2>
      <select class="select" bind:value={provinceIndex}>
         <option value={-1}>All</option>
         {#each provinces as p, idx}
            <option value={idx}>{p}</option>
         {/each}
      </select>
      {#if shopsFiltered.length > 0}
         <h2>2) Select shop to zoom!</h2>
         {#each shopsFiltered as s, idx}
            <div class="btn" on:click={()=>placeIndex = idx}>{s.Shop_name} - {s.Shop_province}</div>
         {/each}
      {:else}
         No shop in that province
      {/if}
   </div>
   <div class="w-3/4">
      <GoogleMapDisplay {names} {ids} {places} bind:placeIndex/>
   </div>
</div>