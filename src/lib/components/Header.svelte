<script lang="ts">
	import NavBar from './NavBar.svelte';
	import AlertList from '$lib/alert/AlertList.svelte';
	import { navigating } from '$app/stores';
	import PageNavIndicator from '$lib/components/PageNavIndicator.svelte';
</script>

<header class="w-screen fixed overflow-x-clip z-20">
	{#if $navigating}
		<PageNavIndicator />
	{/if}
	<NavBar/>
	<AlertList />
	<slot/>
</header>
