<script lang="ts">
	import '../global.css';
    import { navigating } from '$app/stores'
    import PageNavIndicator from '$lib/components/PageNavIndicator.svelte'
	import Header from '$lib/components/Header.svelte'
	import AlertList from '$lib/alert/AlertList.svelte'
	import Footer from '$lib/components/Footer.svelte'
</script>

{#if $navigating}
	<PageNavIndicator />
{/if}
<Header/>
<AlertList/>
<main class="max-w-7xl h-full">
    <slot></slot>
</main>

<Footer/>
