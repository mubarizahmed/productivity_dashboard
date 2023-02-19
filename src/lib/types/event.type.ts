import type { ProjectType } from './project.type';

export type EventType = {
  id: string;
  name: string;
  url: string;
  project: ProjectType;
  isTask: boolean;

  //Todoist specific
  completed?: boolean;
  dueDate?: Date;
  priority?: number;

  //Google Calendar specific
  startDatetime?: Date;
  endDatetime?: Date;
};