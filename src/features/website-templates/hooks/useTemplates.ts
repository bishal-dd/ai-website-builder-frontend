import { useQuery } from "@tanstack/react-query";
import { WebsiteTemplate } from "../types";
import { getAllTemplates } from "../api/getAllTemplates";

export function useTemplates(params?: { category?: string; search?: string }) {
  const { data, isLoading, error } = useQuery<WebsiteTemplate[], Error>({
    queryKey: ["templates", params],
    queryFn: () => getAllTemplates(params),
    staleTime: 1000 * 60,
    retry: 1,
  });

  return {
    templates: data ?? [],
    isLoading,
    error,
  };
}
