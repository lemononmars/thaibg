<script lang="ts">
	import '../global.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initialize } from '../i18n';

	initialize();
</script>

<Header/>
<main class="max-w-7xl h-full lg:px-2">
	<slot/>
</main>


<Footer />
