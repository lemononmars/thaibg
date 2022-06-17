<script lang="ts">
	import {CalendarIcon} from 'svelte-feather-icons'
	export let eventName: string = ''
	export let date: string
	export let eventID: number
	export let location: string

	const formattedDate = date.replace(/\-/g,'')
	export let url: string = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventName}&dates=${formattedDate}&details=For+details,+link+here:+http://thaibg.herokuapp.com/event/${eventID}&location=${location}`
</script>

<div>
	<h2>Add to Google Calendar</h2>
	<div class="tooltip" data-tip="add to google calendar">
		<a href="{url}" target="_blank">
			<div class="btn btn-wide btn-info">
				<CalendarIcon size="2x" />
			</div>
		</a>
	</div>
</div>