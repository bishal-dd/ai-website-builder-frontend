import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projects";
import { Project } from "../types";

export function useProjects() {
  const { data, isLoading, error } = useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 1000 * 60,
    retry: 1,
  });

  return {
    projects: data ?? [],
    isLoading,
    error,
  };
}
