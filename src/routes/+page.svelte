<script>
  import TaskView  from '$lib/components/TaskView.svelte';
</script>

<div class="flex flex-col items-center justify-center min-h-screen py-2">
  <h1 class="text-3xl font-bold">
    Dashboard
  </h1>
  <div class="flex flex-row justify-evenly w-screen">

    <TaskView />
    
    <div class="flex flex-col">
      <h2 class="text-2xl font-bold">
        Upcoming Tasks
      </h2>

    </div>
  </div>
</div>