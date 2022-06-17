<script lang=ts>
   import type {ShopLocation} from '$lib/datatypes'
   import {onMount} from 'svelte'

   const apiKey = String(import.meta.env.VITE_GOOGLE_MAP_API_KEY)

   let mapArea: HTMLElement
   let infowindowContent: HTMLElement

   // support a single place and array of places
   export let places: ShopLocation[] = []
   // note that indices for names and places must match
   export let names: string[] = []
   export let ids: number[] = []

   export let placeIndex: number = 0
   // TODO: add listener
   
   let map: any
   let infowindow: any

   $: if(placeIndex > -1 && map && infowindow) {
      //map.panTo(places[placeIndex].location)
      infowindow.setPosition(places[placeIndex].location)
   }

   onMount(async()=>{
       map = initMap()
   })

   async function initMap(){
      const map = new google.maps.Map(
         mapArea,
         {
            center: places[0].location,
            zoom: 15
         }
      );

      infowindow = new google.maps.InfoWindow();
      infowindow.setContent(infowindowContent);

      const bounds = new google.maps.LatLngBounds();
      // add markers
      places.forEach((p: ShopLocation, index: number) => {
         const marker = new google.maps.Marker({ map: map });

         marker.addListener("click", () => {
            infowindow.open(map, marker);
            placeIndex = index
            //map.panTo(places[index].location)
         });

         marker.setPlace({
            placeId: p.place_id,
            location: p.location,
         });

         marker.setVisible(true);
         bounds.extend(p.location)

         if(index == 0)
            infowindow.open(map, marker);
      })

      if(places.length > 1)
         map.fitBounds(bounds);

      return map
   }
</script>

<svelte:head>
   <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
   <script
     src="https://maps.googleapis.com/maps/api/js?key={apiKey}&region=TH&language=th&libraries=places&v=weekly"
     defer async
   />
</svelte:head>

<div 
   class="h-full w-full"
   bind:this={mapArea}
>
</div>


<div
   class="text-black bg-white"
   bind:this={infowindowContent}
>
   {#if placeIndex > -1}
      <a href="/shop/{ids[placeIndex]}" target="_blank">
         {names[placeIndex]}
      </a>
   {/if}
</div>
