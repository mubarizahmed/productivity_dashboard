import { TodoistApi } from '@doist/todoist-api-typescript';
import type { Task as TaskType } from '@doist/todoist-api-typescript';
import { PUBLIC_TODOIST_API_TOKEN } from '$env/static/public';
import type { EventType } from '$lib/types/types';

const api = new TodoistApi(PUBLIC_TODOIST_API_TOKEN);

function taskToEvent(task: TaskType): EventType {
	var projectFoundId: string =
		'todo/' + (task.sectionId ? task.projectId + '/' + task.sectionId : task.projectId);

	console.log('project found');
	return {
		id: 'todo/' + task.id,
		name: task.content,
		url: task.url,
		projectId: projectFoundId,
		completed: task.isCompleted,
		dueDate: task.due ? new Date(task.due.date).toDateString() : undefined,
		priority: task.priority,
		startDateTime: undefined,
		endDateTime: undefined,
		isTask: true
	};
}

export async function getTodoistData() {
	var res: EventType[] = [];
	var test = await api
		.getTasks({ })
		.then((tasks) => {
			res = tasks.map((task) => {
				return taskToEvent(task);
			});
			console.log('res');
			console.log(res);
		})
		.catch((error) => {
			console.log(error);
		});
	return res;
}

export const editTodoistTask = async (event: EventType) => {
	return api
		.updateTask(event.id.slice(5), {
			content: event.name,
			dueDate: event.dueDate,
			priority: event.priority
		})
		.then((updated) => {
			return taskToEvent(updated);
		})
		.catch((error) => console.log(error));
};

export const completeTodoistTask = async (eventId: string) => {
	return api
		.closeTask(eventId.slice(5))
		.then((completed) => {
			return completed;
		})
		.catch((error) => console.log(error));
};

export const reopenTodoistTask = async (eventId: string) => {
	return api
		.reopenTask(eventId.slice(5))
		.then((reopened) => {
			console.log('reopened', reopened);
			return reopened;
		})
		.catch((error) => console.log(error));
};

export const deleteTodoistTask = async (eventId: string) => {
	return api
		.deleteTask(eventId.slice(5))
		.then((deleted) => {
			return deleted;
		})
		.catch((error) => console.log(error));
};

export const addTodoistTask = async (event: EventType) => {
  return await api
		.addTask({
			content: event.name,
		})
		.then((added) => {
      console.log('added', added);
			return taskToEvent(added);
		})
		.catch((error) => console.log(error));
};
