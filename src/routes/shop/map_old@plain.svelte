<script lang=ts>
   import {LocatorPlus} from './googlemap'

   interface Position {
      lat: number,
      lng: number
   }

   interface Location {
      title: string,
      address1?: string,
      address2?: string,
      coords?: Position,
      placeId?: string
   }

   // TODO: fetch from Shop table
   let locations: Location[] = [
      {
         title:"Lanlalen Voyage",
         address1:"9 Thanon Nang Linchi",
         address2:"Khwaeng Thung Maha Mek, Khet Sathon, Krung Thep Maha Nakhon 10120, Thailand",
         coords:{"lat":13.715090855510699,"lng":100.53966236256561},
         placeId:"ChIJgdkaHsWf4jARIvjxwam0zUA"
      }
   ]

   let l
   async function initMap() {
      l = new LocatorPlus(locations)
   }
   
   $: if(l?.searchLocation) {
      locations.sort(function(a, b) {
         return l.getLocationDistance(a) - l.getLocationDistance(b);
      });
   }
</script>

<svelte:head>
   <!-- key=AIzaSyCt3-uv6RT2jnV8nYYoArO7vRA_azJbLFg -->
   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCt3-uv6RT2jnV8nYYoArO7vRA_azJbLFg&libraries=places,geometry&solution_channel=GMP_QB_locatorplus_v4_cABD" on:load={initMap}></script>
   <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
</svelte:head>

<div id="map-container" class="flex flex-col items-center">
   <div id="gmp-map" class="absolute top-0 left-0 right-0 bottom-1/2"></div>
   <div id="locations-panel" class="absolute top-0 left-0 bg-base-100 border-2 p-4">
      {JSON.stringify(l.searchLocation)}
     <div id="locations-panel-list">
       <header>
         <div class="text-xl flex flex-row gap-2 justify-center">
           <img src="https://fonts.gstatic.com/s/i/googlematerialicons/place/v15/24px.svg" alt="search"/>
           Find a board game shop near you
         </div>
         <div class="search-input">
           <input id="location-search-input" class="input input-bordered w-full" placeholder="Enter your address or zip code">
           <div id="search-overlay-search" class="search-input-overlay search">
             <button id="location-search-button">
               <img class="icon" src="https://fonts.gstatic.com/s/i/googlematerialicons/search/v11/24px.svg" alt="Search"/>
             </button>
           </div>
         </div>
       </header>
      {#if l?.searchLocation}
         <div>Nearest locations ({locations.length})</div>
      {:else}
         <div>All locations ({locations.length})</div>
      {/if}
       <div class="results">
         <ul id="location-results-list">
            {#each locations as l}
               <li class="location-result text-left">
                  <button class="select-location">
                     <h2 class="name">{l.title}</h2>
                  </button>
                  <div class="text-xs">{l.address1}<br>{l.address2}</div>
               </li>
            {/each}
         </ul>
       </div>
     </div>
   </div>
 </div>