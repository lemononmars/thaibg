<script lang="ts">
	import '../global.css';
	import AlertList from '$lib/alert/AlertList.svelte';
	import SettingsCompact from '$lib/components/SettingsCompact.svelte';
	import { initialize } from '../i18n';

	initialize();
</script>

<main class="w-full min-w-max h-full pt-4">
	<div class="fixed top-0 right-0 m-2 mt-20">
		<SettingsCompact/>
	</div>
	<AlertList />
	<slot/>
</main>