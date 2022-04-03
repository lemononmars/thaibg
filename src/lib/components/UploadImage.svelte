<script lang=ts>
   export let imageFile: File
   let displayImage

   function change(event: any){
      const target = event.target
      if (!target!.files || target.files.length == 0) {
         throw 'You must select an image to upload.'
      }
      imageFile = target.files[0]
      displayImage.onload = () => {
         URL.revokeObjectURL(displayImage.src)
      }
      displayImage.src = URL.createObjectURL(imageFile)
   }
</script>

<label class="btn" for="single">Upload an image</label>
   <input
      class="sr-only"
      type="file"
      id="single"
      accept="image/*"
      bind:value={imageFile}
      on:change={change}
   />
   {#if imageFile}
    <img class="w-48 aspect-auto" src="#" alt='img' bind:this={displayImage}/>
   {/if}