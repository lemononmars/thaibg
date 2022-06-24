<script lang="ts">
	import '../global.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initialize } from '../i18n';

	initialize();
</script>

<Header/>
<main class="w-full max-w-max h-full overflow-x-hidden">
	<slot/>
</main>
<Footer />
