<script lang="ts">
	import '../global.css';
    import { navigating } from '$app/stores'
    import PageNavIndicator from '$lib/components/PageNavIndicator.svelte'
	import Header from '$lib/components/Header.svelte'
	import AlertList from '$lib/alert/AlertList.svelte'
</script>

{#if $navigating}
	<PageNavIndicator />
{/if}
<Header/>
<AlertList/>
<main class="px-2 mx-auto max-w-7xl h-full sm:px-6 lg:px-8">
    <slot></slot>
</main>
<!-- <Footer/> -->

<style style lang="postcss">
</style>
