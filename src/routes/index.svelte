<script lang="ts" context="module">

    export async function load({ session }) {
        const { user } = session
        return {
            props: {
                user
            }
        };
    }
</script>

<script lang="ts">
    import Seo from '$lib/components/SEO.svelte'

    export let user
</script>

<Seo title="Home"/>
<div class="flex flex-col justify-center items-center relative">
    
<div class="hero min-h-screen" style="background-image: url(&quot;https://picsum.photos/id/180/600/400&quot;);">
    <div class="hero-overlay bg-opacity-60"></div> 
    <div class="text-center hero-content text-neutral-content">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">
              Hello there
            </h1> 
        <p class="mb-5">
              Browse?
            </p> 
        <button class="btn btn-primary">Yes</button>
      </div>
    </div>
  </div>
</div>