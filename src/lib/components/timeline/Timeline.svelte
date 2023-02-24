<script lang="ts">
	import '@fullcalendar/core/vdom';
	import FullCalendar, { type CalendarOptions } from 'svelte-fullcalendar';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import { eventStore } from '$lib/store/eventStore';

	let options: CalendarOptions = {
		plugins: [timeGridPlugin],
		initialView: 'timeGridFourDay',
		views: {
			timeGridFourDay: {
				type: 'timeGrid',
				duration: { days: 1 }
			}
		},
		headerToolbar: false,
		height: '100%',
		events: [
			{
				title: 'event1',
				start: new Date().toISOString(),
				end: '2021-05-07T07:00:00',
				display: 'background'
			},
			{
				title: 'event2',
				start: '2023-02-24T05:00:00',
				end: '2023-02-24T06:00:00',
				display: 'background'
			}]
	};
</script>

<div class=".fc text-cool-gray text-xs .fc-timegrid-col.fc-day-today h-80 w-full bg-rich-black-2">
	<FullCalendar {options} class=".fc .fc-timegrid-col.fc-day-today" />
</div>


<svelte:head>
	<style type = "text/css">
	:root {

		--fc-today-bg-color:#0D0C1Eff;
		--fc-border-color: #201E3Cff;
		/* --fc-bg-event-color: #29B67Eff; */
		--fc-bg-event-opacity: 1;
	}
	.fc-theme-standard .fc-scrollgrid {
		border: 0px;
	}
	.fc .fc-bg-event{
		border-radius: 4px;
		background-color: #29B67Eff;
		color: #FFFFFF;
		font-weight: bold;
	}

	.fc .fc-timegrid-slot{
		border: 0px;
	}
		.fc .fc-timegrid-col.fc-day-today {

		}

	</style>
</svelte:head>
