<script lang="ts">
	// import { projects } from '$lib/store/stores';
	import { onMount } from 'svelte';
	import { TodoistApi } from '@doist/todoist-api-typescript';
	import { PUBLIC_TODOIST_API_TOKEN } from '$env/static/public';
	import type { ProjectType } from '$lib/types/project.type';
	import { projects } from '$lib/store/stores';
	import { projectStore } from '$lib/store/projectStore';

	const api = new TodoistApi(PUBLIC_TODOIST_API_TOKEN);

	onMount(() => {
		console.log('projects mounted');
		var project = {
			id: 'gcal/primary',
			name: 'Primary',
			todoistId: '',
			todoistURL: '',
			calendarId: 'primary',
			calendarName: 'Primary',
			color: 'pd-gray'
		};
		projectStore.addProject(project);

		project = {
			id: 'gcal/4ae44282c14f6b5f93b3881395d3be21ef30c90e45a5c5d1512d456d403563bc@group.calendar.google.com',
			name: 'Planner',
			todoistId: '',
			todoistURL: '',
			calendarId:
				'4ae44282c14f6b5f93b3881395d3be21ef30c90e45a5c5d1512d456d403563bc@group.calendar.google.com',
			calendarName: 'Planner',
			color: 'pd-green'
		};
		projectStore.addProject(project);

		project = {
			id: 'gcal/8tciba5ockfvb8rklc4hppqqao@group.calendar.google.com',
			name: 'Classes',
			todoistId: '',
			todoistURL: '',
			calendarId: '8tciba5ockfvb8rklc4hppqqao@group.calendar.google.com',
			calendarName: 'Classes',
			color: 'pd-blue'
		};
		projectStore.addProject(project);

		getTodoistData();
	});

	// getTodoistData();
	async function getTodoistData() {
		// get projects
		api
			.getProjects()
			.then((todoistProjects) => {
				console.log(projects);
				todoistProjects.forEach((todoistProject) => {
					projectStore.addProject({
						id: "todo/"+todoistProject.id,
						name: todoistProject.name,
						todoistId: todoistProject.id,
						todoistURL: todoistProject.url,
						calendarId:
							'4ae44282c14f6b5f93b3881395d3be21ef30c90e45a5c5d1512d456d403563bc@group.calendar.google.com',
						calendarName: 'Planner',
						color: 'pd-' + todoistProject.color
					});
				});
				// get sections
				api
					.getSections()
					.then((sections) => {
						console.log(sections);
						sections.forEach((section) => {
							var project = getProject(section.projectId);
              if (project){
                projectStore.addProject({
									id: "todo/"+project.todoistId+'/'+section.id,
                  name: project.name + '/' + section.name,
                  todoistId: project.todoistId,
                  todoistURL: project.todoistURL,
                  calendarId:
                    '4ae44282c14f6b5f93b3881395d3be21ef30c90e45a5c5d1512d456d403563bc@group.calendar.google.com',
                  calendarName: 'Planner',
                  color: 'pd-' + project.color
                });
              }
						});
					})
					.catch((error) => console.log(error));
			})
			.catch((error) => console.log(error));
	}

  function getProject(id: string) {
    return $projects.find((project) => project.todoistId === id);
  }
	
	$: console.log($projectStore);
  $: console.log($projects);
</script>

