import { Project } from "../types";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/websites`,
    { credentials: "include" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch projects: ${text}`);
  }

  return res.json();
}
