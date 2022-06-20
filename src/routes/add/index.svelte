<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import {getTypeIcon} from '$lib/assets/icons'
	
	import boardGameStages from '$lib/assets/board-game-stages.svg'
	import VerticalBlock from './_createBlockVertical.svelte';
	import HorizontalBlock from './_createBlockHorizontal.svelte';

	const types = ['person', 'organization', 'boardgame', 'content', 'event', 'honor']
	const icons = types.map((t:string) => getTypeIcon(t))
	const descriptions = {
		th: [
			'ผู้ร่วมผลิตบอร์ดเกมไทย',
			'องค์กรที่ช่วยผลิตและโปรโมทบอร์ดเกมไทย',
			'บอร์ดเกมไทย',
			'บทความ คลิป และสื่อต่าง ๆ ที่เกี่ยวกับบอร์ดเกมไทย',
			'งานชุมนุม งาน playtest และกิจกรรมที่เกี่ยวกับบอร์ดเกมไทย',
			'การแข่งขัน งานประกวด และรางวัลสำหรับบอร์ดเกมไทย'
		],
		en: [
			'A person who helps creating Thai board games',
			'An organization who helps creating and promoting Thai board games',
			'Thai board games',
			'Articles, clips, and all sorts of contents relating to Thai board games',
			'Conventions, playtest events, and all activities relating to Thai board games',
			'Competitions, contests, and awards for Thai board games'
		]
	}
	$: blockProps = types.map((type:string, i:number) => ({
		icon: icons[i],
		type,
		description: descriptions[$locale][i]
	}))
</script>

<div class="flex flex-col justify-center gap-4 mx-auto w-fit mt-4">
	<div class="flex flex-col lg:flex-row items-center gap-2">
		<VerticalBlock {...blockProps[0]}/>
		<VerticalBlock {...blockProps[1]}/>	
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
		<div class="rounded-t-xl bg-info py-10">
			<p class="text-content-info text-4xl">4 Stages of Board Game Development</p>
		</div>
		<div class="mx-auto my-4 w-full">
			<img src={boardGameStages} alt="board game stages" class="aspect-auto"/>
		</div>
	</div>
</div>


