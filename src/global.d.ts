/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare global {
   interface Window {
      initMap: () => void;
   }
}

window.initMap = initMap;

declare var google: any