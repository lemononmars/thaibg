<script lang=ts>
   import type {ShopLocation} from '$lib/datatypes'
   import { createEventDispatcher, onMount } from 'svelte'

	const dispatch = createEventDispatcher();

   let inputBox: HTMLElement
   let mapArea: HTMLElement
   let infowindowContent: HTMLElement

   let selectedPlace: ShopLocation = {}
   let place: any

   onMount(async()=>{
      initMap()
   })

   function initMap(): void {
      console.log('map initiated')
      const map = new google.maps.Map(
         mapArea,
         {
            center: { lat: 13, lng: 99 },
            zoom: 6,
         }
      );

      // Specify just the place data fields that you need.
      const autocomplete = new google.maps.places.Autocomplete(inputBox, {
         fields: ["place_id", "geometry", "formatted_address", "name"],
         strictBounds: true
      });

      autocomplete.bindTo("bounds", map);

      map.controls[google.maps.ControlPosition.TOP].push(inputBox);

      const infowindow = new google.maps.InfoWindow();
      infowindow.setContent(infowindowContent);

      const marker = new google.maps.Marker({ map: map });

      marker.addListener("click", () => {
         infowindow.open(map, marker);
      });

      autocomplete.addListener("place_changed", () => {
         infowindow.close();
         
         place = autocomplete.getPlace();

         if (!place.geometry || !place.geometry.location) {
            return;
         }

         if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
         } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
         }

         // Set the position of the marker using the place ID and location.
         // @ts-ignore This should be in @typings/googlemaps.
         marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location,
         });

         marker.setVisible(true);
         infowindow.open(map, marker);
      });
   }

   function selectPlace() {
      let unwrap = ({place_id, geometry, formatted_address}) => ({place_id, location: geometry.location, formatted_address})
      selectedPlace = unwrap(place)
      dispatch('select', {
			place: selectedPlace
		});
   }
</script>

<svelte:head>
   <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
   <script
     src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCt3-uv6RT2jnV8nYYoArO7vRA_azJbLFg&libraries=places&v=weekly"
     defer async
   />
</svelte:head>

<div class="h-full w-full">
   <input
      class="input input-xl w-1/2 mt-4"
      type="text"
      placeholder="Enter a location"
      bind:this={inputBox}
   />

   <div 
      class="h-full w-full"
      bind:this={mapArea}
   >
   </div>

   <div
      bind:this={infowindowContent}
   >
      {#if place}
         <div class="text-left break-words text-black bg-white p-4">
            <h2>{place.name}</h2>
            <p>{place.formatted_address}</p>
            <div class="btn mx-auto mt-2" on:click={selectPlace}>
               Select this location
            </div>
         </div>
      {/if}
   </div>
</div>