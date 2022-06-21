<script lang=ts>
   import type {ShopLocation, Shop} from '$lib/datatypes'
   import {onMount} from 'svelte'

   interface ShopMinimal {
      Shop_name: string,
      Shop_ID: number,
      Shop_location: ShopLocation,
      Shop_province: string
   }

   const apiKey = String(import.meta.env.VITE_GOOGLE_MAP_API_KEY)

   let mapArea: HTMLElement
   let infowindowContent: HTMLElement
   let actionWindow: HTMLElement

   // support a single place and array of places
   export let shops: ShopMinimal[] = []

   export let currentShopID: number = -1
   // TODO: add listener
   
   let map: google.maps.Map
   let infowindow: any
   let bounds: any

   $: if(currentShopID > -1 && map && infowindow) {
      const location = getCurrentShop(currentShopID).Shop_location.location
      map.panTo(location)
      infowindow.setPosition(location)
   }

   function getCurrentShop(shopID: number){
      return shops.filter(s=>s.Shop_ID === shopID)[0]
   }

   onMount(async()=>{
       initMap()
   })

   function initMap(): void{
      map = new google.maps.Map(
         mapArea,
         {
            center: shops[0].Shop_location?.location,
            zoom: 15
         }
      );

      infowindow = new google.maps.InfoWindow();
      infowindow.setContent(infowindowContent);
      infowindow.setPosition(shops[0].Shop_location.location)

      map.controls[google.maps.ControlPosition.TOP].push(actionWindow);

      bounds = new google.maps.LatLngBounds();
      // add markers
      shops.forEach((s: Shop) => {
         if(s.Shop_location?.location) {
            const marker = new google.maps.Marker({ 
               map: map,
            });

            marker.addListener("click", () => {
               infowindow.open(map, marker);
               currentShopID = s.Shop_ID
               // map.setZoom(16)
               map.setCenter(s.Shop_location.location)
            });

            marker.setPlace({
               placeId: s.Shop_location.place_id,
               location: s.Shop_location.location,
            });

            marker.setVisible(true);
            bounds.extend(s.Shop_location.location)
         }
      })

      if(shops.length > 1)
         map.fitBounds(bounds);
   }

   function reset(){
      map.fitBounds(bounds)
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
   {#if currentShopID > -1}
      <a href="/shop/{currentShopID}" target="_blank">
         <p class="text-2xl">{getCurrentShop(currentShopID).Shop_name}</p>
      </a>
   {/if}
</div>

<div
   class="text-black bg-white"
   bind:this={actionWindow}
>
   <div class="btn absolute l-0 z-30" on:click={reset}>
      Reset
   </div>
</div>