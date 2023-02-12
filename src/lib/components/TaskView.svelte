<script>
  import { TodoistApi } from "@doist/todoist-api-typescript";
  import { PUBLIC_TODOIST_API_TOKEN } from '$env/static/public';
  console.log(PUBLIC_TODOIST_API_TOKEN);
  const api = new TodoistApi(PUBLIC_TODOIST_API_TOKEN)

  let tasksList = [];

  api.getTasks({filter: "today | overdue" })
    .then((tasks) => {
      console.log(tasks);
      tasksList = tasks;
    })
    .catch((error) => console.log(error))
</script>

<div class="flex flex-col items-center  min-h-screen py-2">
  <h1 class="text-2xl font-bold justify-start">
    Today's Tasks
  </h1>

  <ul>
    {#each tasksList as task}
      <li>{task.content}</li>
    {/each}
  </ul>

</div>

