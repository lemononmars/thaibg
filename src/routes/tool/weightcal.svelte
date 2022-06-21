<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { _ } from 'svelte-i18n';
	import RangeSlider from "svelte-range-slider-pips"

	const questions = [
		`Playtime`,
		`Available actions`,
		`Rulebook's thickness`,
		`Scoring system`,
		`Luck`
	]

	const options = [
		['short', 'long'],
		['few', 'many'],
		['thin', 'thick'],
		['simple', 'complicated'],
		['mostly luck', 'no luck']
	]

	const weights = [20, 20, 30, 20, 10]
	const values = [[30], [30], [30], [30], [30]]

	$: calculatedWeight = weights.reduce((prev, curr, idx) => prev + curr * values[idx][0], 0)
</script>

<Seo title="Weight Calculator" />
<div class="flex flex-col justify-left text-left">
<h1>Weight Calculator</h1>
<p>Tell us about your game, and we'll give get an estimate on its weight.</p>

<div class="flex flex-col gap-2">
	{#each questions as q, idx}
		<div class="flex flex-col bg-base-300 p-2 lg:w-1/2 mx-auto">
			<div class="mx-auto"><h2>{q}</h2></div>
				<div class="flex flex-row gap-1">
					<p class="w-40 text-right">{options[idx][0]}</p>
					<div class="w-full -translate-y-3">
						<RangeSlider 
							bind:values={values[idx]}
							id="rangeSlider"
							min={10} max={50}
							step={1}
							springValues={{stiffness:0.3, damping:0.4}}
						/>
					</div>
					<p class="w-40 text-left">{options[idx][1]}</p>
			</div>
		</div>
	{/each}
</div>

<div class="mx-auto">
	Approximated weight is {calculatedWeight/1000}
</div>
</div>
