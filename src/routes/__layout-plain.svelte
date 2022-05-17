<script lang="ts">
	import '../global.css';
	import AlertList from '$lib/alert/AlertList.svelte';
	import { initialize } from '../i18n';

	initialize();
</script>

<main class="w-full min-w-max h-full">
	<AlertList />
	<slot/>
</main>