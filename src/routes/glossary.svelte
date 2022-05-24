<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';

	const glossaries = [
		{word: 'planned', definition: `The first stage of board game development. You have an idea that seems awesome... in your head. It might be a twist on a mechanics of another game, a theme that excites you, or an innovation nobody has ever thought of! Fasten your seatbelt, because the long trip has just begun!`},
		{word: 'pending', definition: `The second stage of board game development. The idea seems promising, so you start pushing it! There will be lots of prototypes, rough and dirty, and rules will change daily.`},	
		{word: 'prototype', definition: `The third stage of board game development. Your prototype is stable, and you start investing time in art and graphic design.`},	
		{word: 'published', definition: `The fourth and final stage of board game development. You have a polished copy of your game at hand. It might be the only copy on earth, or one of the thousands played by people around the world. Be proud of yourself!`}
	]
</script>

<Seo title={"Glossary"} />

<div class="flex flex-col text-left">
	{#each glossaries as g}
		<h1><a href="#{g.word}">{g.word}</a></h1>
		<p>{g.definition}</p>
	{/each}
</div>