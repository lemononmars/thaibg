<script context=module lang=ts>
	export async function load({ fetch }) {
		const res = await fetch('/api/stats');
		const stats = await res.json();
		return {
			props: {
				stats
			}
		};
	}
</script>

<script lang="ts">
	import { _ } from 'svelte-i18n';
	import {getTypeIcon} from '$lib/assets/icons'
	
	import boardGameStages from '$lib/assets/board-game-stages.png'
	import linkLeft from '$lib/assets/link-left.png'
	import linkRight from '$lib/assets/link-right.png'
	//import { CoffeeIcon, PlayCircleIcon, UserCheckIcon } from 'svelte-feather-icons';
	import VerticalBlock from './_createBlockVertical.svelte';
	import HorizontalBlock from './_createBlockHorizontal.svelte';

	//export let stats: Record<string, number>

	const types = ['person', 'organization', 'boardgame', 'content', 'event', 'honor']
	const icons = types.map((t:string) => getTypeIcon(t))
	const descriptions = [
		'A person who helps creating Thai board games',
		'An organization who helps creating and promoting Thai board games',
		'Thai board games',
		'Articles, clips, and all sorts of contents relating to Thai board games',
		'Conventions, playtest events, and all activities relating to Thai board games',
		'Competitions, contests, and awards for Thai board games'
	]

	const blockProps = types.map((type:string, i:number) => ({
		icon: icons[i],
		type,
		description: descriptions[i]
	}))
</script>


<div class="flex flex-col justify-center gap-4 mx-auto w-fit mt-4">
	<div class="flex flex-col lg:flex-row items-center">
		<!-- <div class="hidden lg:grid lg:grid-cols-1 place-items-center py-8 m-2 w-1/6">
			<div class="flex flex-col place-items-center">
				<div class="flex flex-row items-center gap-2">
					<div class="text-2xl">{stats.boardgame}</div>
					<div><PlayCircleIcon size="40" /></div>
				</div>
				<div>{$_('page.home.welcome.boardgames')}</div>
			</div>
			<div class="flex flex-col place-items-center">
				<div class="flex flex-row items-center gap-2">
					<div class="text-2xl">{stats.person}</div>
					<div><UserCheckIcon size="40" /></div>
				</div>
				<div>{$_('page.home.welcome.people')}</div>
			</div>
			<div class="flex flex-col place-items-center">
				<div class="flex flex-row items-center gap-2">
					<div class="text-2xl">{stats.content}</div>
					<div><CoffeeIcon size="40" /></div>
				</div>
				<div>{$_('page.home.welcome.contents')}</div>
			</div>
		</div> -->
		<VerticalBlock {...blockProps[0]}/>
		<img src={linkLeft} alt="link-left" class="w-20 -mx-4 -z-10 hidden lg:inline"/>
		<VerticalBlock {...blockProps[1]}/>	
		<img src={linkRight} alt="link-right" class="w-20 -mx-4 -z-10 hidden lg:inline"/>
		<VerticalBlock {...blockProps[2]} width={2}>
			<slot>
				<div class="flex flex-col items-center">
					<HorizontalBlock {...blockProps[3]}/>
					<HorizontalBlock {...blockProps[4]}/>
					<HorizontalBlock {...blockProps[5]}/>
				</div>
			</slot>
		</VerticalBlock>
	</div>
	<div class="flex flex-col rounded-xl shadow-xl m-4">
		<div class="rounded-t-xl bg-info text-content-info p-4">
			<h1>4 Stages of Board Game Development</h1>
		</div>
		<div class="mx-auto my-4">
			<img src={boardGameStages} alt="board game stages" class="w-max aspect-auto"/>
		</div>
	</div>
</div>


