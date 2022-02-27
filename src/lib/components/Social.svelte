<script lang="ts">
  import { Facebook, Twitter } from "svelte-share-buttons-component"

  export let url: string
  export let title: string
</script>

{#if url}
  <div
    class="flex gap-2"
  >
    <Facebook class="h-10 w-10" {url} />
    <Twitter class="h-10 w-10" text={title} {url} />
  </div>
{/if}
