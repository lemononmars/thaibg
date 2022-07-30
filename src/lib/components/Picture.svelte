<script lang=ts>
   import {getImageURL, getDefaultImageURL} from '$lib/supabase'

   export let type: string
   export let picture: string
   export let height: number = 0
   export let mask: string = 'circle'

   let heightStr = height != 0 ? 'h-' + height : 'h-72'
   const maskStr = 'mask-' + mask
</script>

<div class="avatar {$$props.class} {heightStr}">
   <div class=" mask {maskStr} hover:scale-110 duration-200 mx-auto h-full aspect-square">
      <img
         src={getImageURL(type, picture)}
         alt="image of {type}"
         on:error|once={(ev) => (ev.target.src = getDefaultImageURL(type))}
         crossorigin="anonymous"
      />
   </div>
</div>