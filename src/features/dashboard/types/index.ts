export type ProjectStatus = "completed" | "deploying" | "failed";

export interface Project {
  id: string;
  name: string;
  domain: string | null;
  status: ProjectStatus;
  createdAt: string;
}
