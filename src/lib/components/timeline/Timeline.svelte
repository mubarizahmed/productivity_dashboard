<script>
  import TimelineEvent from './TimelineEvent.svelte';
  import { dndzone } from 'svelte-dnd-action';
	export let events = [];
	export let todayDate;

  function moveEvent(e){
    console.log(e.detail);
  }
</script>

<div class="container h-96 overflow-y-scroll">
	<div class="flex h-full w-full">
		<section class="h-fit w-full flex-[1] bg-red-600">
			<!-- loop from 0 - 23 and create label -->
			{#each Array(24) as _, i}
				<div class="h-16 w-full flex-col items-start justify-center">
					<div class="h-[1px] w-full bg-white" />
					<span class="text-xs text-white">{i}:00</span>
				</div>
			{/each}
		</section>

		<section use:dndzone={{items: events}} on:finalize={moveEvent} class="h-fit bg-white w-full flex-[3] px-2">
			{#each events as event, index (event.id)}
        <TimelineEvent 
          distanceToPrevious={events[index - 1]
            ? (Date.parse(event.start.dateTime) - Date.parse(events[index - 1].end.dateTime))
            : (Date.parse(event.start.dateTime) - todayDate)}
          duration={(Date.parse(event.end.dateTime) - Date.parse(event.start.dateTime))}
          event={event}
        />
			{/each}

		</section>
	</div>
</div>
