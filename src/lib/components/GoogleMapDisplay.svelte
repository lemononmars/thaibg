<script lang=ts>
   import type {ShopLocation} from '$lib/datatypes'

   let mapArea: HTMLElement
   let infowindowContent: HTMLElement

   // support a single place and array of places
   export let places: ShopLocation[] = []
   export let place: ShopLocation = {}
   // note that indices for names and places must match
   export let names: string[] = []
   export let name: string = ''
   export let ids: number[] = []
   export let id: number = 0

   export let placeIndex: number = -1
   $: if(placeIndex) {

   }

   if(!places || places.length == 0) {
      places = new Array(place)
      names = new Array(name)
      ids = new Array(id)
   }

   function initMap(): void {
      const map = new google.maps.Map(
         mapArea,
      );

      const infowindow = new google.maps.InfoWindow();
      infowindow.setContent(infowindowContent);

      const bounds = new google.maps.LatLngBounds();
      // add markers
      places.forEach((p: ShopLocation, index: number) => {
         const marker = new google.maps.Marker({ map: map });

         marker.addListener("click", () => {
            infowindow.open(map, marker);
            placeIndex = index
            map.setPlace(places[index])
         });

         marker.setPlace({
            placeId: p.place_id,
            location: p.location,
         });

         marker.setVisible(true);
         bounds.extend(p.location)
      })

      if(places.length > 1)
         map.fitBounds(bounds);
   }
</script>

<svelte:head>
   <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
   <script
     src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCt3-uv6RT2jnV8nYYoArO7vRA_azJbLFg&region=TH&language=th&libraries=places&v=weekly"
     on:load={initMap}
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
