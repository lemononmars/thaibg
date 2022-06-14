<script lang=ts>
   import type {ShopLocation} from '$lib/datatypes'
   const apiKey = String(import.meta.env.VITE_GOOGLE_MAP_API_KEY)

   export let place: ShopLocation = {}
   // note that indices for names and places must match
   export let name: string = ''
   export let id: number = 0
   export let width: number = 450
   export let height: number = 250
</script>

<div>
   <iframe
      title="{name} {id}"
      {width}
      {height}
      frameborder="0" style="border:0"
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/embed/v1/place?key={apiKey}&q=place_id:{place.place_id}"
      allowfullscreen>
   </iframe>
</div>
