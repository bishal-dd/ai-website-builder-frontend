import { useEffect, useState } from "react";

export type ProjectStatus = "completed" | "deploying" | "failed";

export interface Project {
  id: string;
  name: string;
  domain: string | null;
  status: ProjectStatus;
  createdAt: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/websites`,
          {
            credentials: "include", // send session cookie
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch projects", await res.text());
          throw new Error("Failed to fetch projects");
        }

        const data: Project[] = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading };
}
