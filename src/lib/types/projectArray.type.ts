import type { ProjectType } from "./project.type";

export type ProjectArrayType = Array<ProjectType> & {
  addProject: (project: ProjectType) => void;

}