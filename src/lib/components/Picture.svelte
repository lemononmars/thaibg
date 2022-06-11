<script lang=ts>
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export let type: string
   export let picture: string
   export let height: number = 72
   export let mask: string = 'circle'

   const heightStr = 'h-' + height
   const maskStr = 'mask-' + mask
</script>

<div class="avatar {$$props.class} {heightStr}">
   <div class=" mask {maskStr} hover:scale-110 duration-200 mx-auto h-full aspect-square">
      <img
         src={getImageURL(type, picture)}
         alt="image of {type}"
         on:error|once={(ev) => (ev.target.src = getDefaultImageURL(type))}
      />
   </div>
</div>