<script>
	export let distanceToPrevious;
	export let duration;
  export let event;
</script>

<div
	class="w-full flex-col items-start justify-center rounded bg-gray-200"
	style="
            margin-top: {distanceToPrevious / 56250 + 'px'};
            height: {duration / 56250 + 'px'}"
>
	<span class="text-xs">{event.summary}</span>
	<span class="text-xs"
		>{(Date.parse(event.end.dateTime) - Date.parse(event.start.dateTime)) / 225000}</span
	>
	<span class="text-xs">
		{distanceToPrevious / 56250 + 'px'}
	</span>
</div>
