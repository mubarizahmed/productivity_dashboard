<script lang="ts">
	import '@fullcalendar/core/vdom';
	import FullCalendar, { type CalendarOptions, CalendarApi } from 'svelte-fullcalendar';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import { eventStore, todayEvents } from '$lib/store/eventStore';
	import interactionPlugin from '@fullcalendar/interaction';
	import Icon from '@iconify/svelte';

	let options: CalendarOptions;
	let todayDate: Date = new Date();
  let calendarRef;

  function next() {
    const calendarApi : CalendarApi = calendarRef.getAPI();
    calendarApi.next();
  }
	function prev() {
		const calendarApi : CalendarApi = calendarRef.getAPI();
		calendarApi.prev();
	}
	function now() {
		const calendarApi : CalendarApi = calendarRef.getAPI();
		calendarApi.today();
		todayDate = new Date();
		options.scrollTime = new Date(todayDate.valueOf() - 7200000).toTimeString();
	}
	console.log('today date: ', todayDate.toTimeString());

	$: options = {
		plugins: [timeGridPlugin, interactionPlugin],
		initialView: 'timeGridFourDay',
		views: {
			timeGridFourDay: {
				type: 'timeGrid',
				duration: { days: 1 }
			}
		},
		droppable: true,
		headerToolbar: false,
		height: '100%',
		editable: true,
		dayHeaders: false,
		allDaySlot: false,
		scrollTime: new Date(todayDate.valueOf() - 7200000).toTimeString(),
		nowIndicator: true,
		displayEventTime: false,
		eventSources: [
			{
				events: $todayEvents,
				className: 'g-cal-event',
				editable: true,
				startEditable: true
			}
		],
		eventDataTransform: function (event) {
			return {
				title: event.name,
				start: event.startDateTime,
				end: event.endDateTime,
				id: event.id
			};
		},
		eventDrop: function (info) {
			var editEvent = $eventStore.find((e) => e.id === info.event._def.publicId);
			console.log('edit event: ', editEvent, info.delta.milliseconds);
			if (editEvent && editEvent.startDateTime && editEvent.endDateTime) {
				editEvent.startDateTime = new Date(
					Date.parse(editEvent.startDateTime) + info.delta.milliseconds
				).toISOString();
				editEvent.endDateTime = new Date(
					Date.parse(editEvent.endDateTime) + info.delta.milliseconds
				).toISOString();
				console.log('edit event: ', editEvent);
				eventStore.editCalendarEvent(editEvent);
			}
		},
		eventResize: function (info) {
			var editEvent = $eventStore.find((e) => e.id === info.event._def.publicId);
			console.log(
				'resize event: ',
				editEvent,
				info.startDelta.milliseconds,
				info.endDelta.milliseconds
			);
			if (editEvent && editEvent.startDateTime && editEvent.endDateTime) {
				editEvent.startDateTime = new Date(
					Date.parse(editEvent.startDateTime) + info.startDelta.milliseconds
				).toISOString();
				editEvent.endDateTime = new Date(
					Date.parse(editEvent.endDateTime) + info.endDelta.milliseconds
				).toISOString();
				console.log('edit event: ', editEvent);
				eventStore.editCalendarEvent(editEvent);
			}
		},
		eventReceive: function (info) {
			console.log('drop event: ', info);
			var editEvent = $eventStore.find((e) => e.id === info.event._def.publicId);
			console.log('drop event: ', editEvent);
			// if (editEvent && editEvent.startDateTime && editEvent.endDateTime) {
			// 	editEvent.startDateTime = new Date(
			// 		Date.parse(editEvent.startDateTime) + info.delta.milliseconds
			// 	).toISOString();
			// 	editEvent.endDateTime = new Date(
			// 		Date.parse(editEvent.endDateTime) + info.delta.milliseconds
			// 	).toISOString();
			// 	console.log('edit event: ', editEvent);
			// 	eventStore.editCalendarEvent(editEvent);
			// }
		}
	};

	$: console.log($todayEvents);
	$: console.log('eventStore:', $eventStore);
</script>

<div
	class="flex min-h-full flex-[1] flex-col items-center justify-start gap-6 rounded-xl border-2 border-space-cadet bg-rich-black-2 p-4 text-cool-gray drop-shadow-2xl"
>
	<div class="flex w-full flex-row items-center justify-between">
		<!--  -->
		<a
			href="https://todoist.com/app/upcoming"
			target="_blank"
			rel="noopener noreferrer"
			class="z-10"
		>
			<!-- <img src={TodoistIcon} class="h-6 w-6 hover:fill-[#e44332]" /> -->
			<svg
				class="h-6 w-6 fill-cool-gray hover:fill-[#e44332] "
				role="img"
				viewBox="3 3 18 18"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm3-4H9v-2h6v2zm3-4h-6V7h6v2z"
				/></svg
			>
			<!-- <Icon class="h-6 w-6 hover:fill-[#e44332]" icon="simple-icons:todoist"  /> -->
		</a>
		<h1 class="justify-center text-left text-2xl">Timeline</h1>

		<!-- refresh button -->
		<button class="z-10 h-max" on:click={eventStore.loadCalendarEvents}>
			<Icon icon="material-symbols:refresh" color="#e44332" class="h-6 w-6" />
		</button>
	</div>

	<!-- row of buttons -->
	<div class='flex justify-between w-full'>
		<button class=' z-10' on:click={prev}>
			<Icon class="h-6 w-6" icon="material-symbols:arrow-back" />
		</button>
		<button class=' z-10' on:click={now}>Today</button>
		<button class=' z-10' on:click={next}>
			<Icon class="h-6 w-6" icon="material-symbols:arrow-forward" />
		</button>
	</div>

	<div class="h-80 w-full overflow-clip rounded-lg border border-space-cadet text-xs">
		<FullCalendar bind:this={calendarRef} {options} />
	</div>
</div>

<svelte:head>
	<style type="text/css">
		:root {
			--fc-today-bg-color: #0d0c1eff;
			--fc-border-color: #201e3cff;
			/* --fc-bg-event-color: #29B67Eff; */
			--fc-bg-event-opacity: 1;
			--fc-event-border-color: #0084f5ff;
		}
		.fc-theme-standard .fc-scrollgrid {
			border: 0px;
		}
		.g-cal-event {
			/* box-sizing: content-box; */
			padding: 4px;
			border-radius: 4px;
			background-color: #0084f5ff;
			color: #000000;
			font-size: 1rem;
			/* border-width: 0px;
			border-style: none;
			outline-style: none;
			box-shadow: none; */
			outline: 2px solid #0d0c1eff;
			outline-offset: 0px;
		}
		.todo-event{
			padding: 4px;
			border-radius: 4px;
			border-width: 0px;
			font-size: 0.75rem;
			outline: 2px solid #0d0c1eff;
			outline-offset: 0px;
		}

		.fc .fc-bg-event {
			border-radius: 4px;
			background-color: #0084f5ff;
			font-weight: bold;
		}

		.fc .fc-timegrid-slot-minor {
			border: 0px;
		}

		/* Works on Firefox */
		* {
			scrollbar-width: thin;
			scrollbar-color: white #201e3cff;
		}

		/* Works on Chrome, Edge, and Safari */
		*::-webkit-scrollbar {
			width: 12px;
		}

		*::-webkit-scrollbar-track {
			background: #0d0c1eff;
		}

		*::-webkit-scrollbar-thumb {
			background-color: white;
			border-radius: 20px;
			border: 3px solid #201e3cff;
		}
	</style>
</svelte:head>
