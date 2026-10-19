import { projects } from "@/data/projects";
import type { Project } from "@/types/content";

export async function getProjects(): Promise<Project[]> {
  return projects;
}
