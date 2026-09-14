import { useQuery } from "@tanstack/react-query";
import { getPageVersions } from "../api/getPageVersions";

export function usePageVersions(pageId: string) {
  return useQuery({
    queryKey: ["page-versions", pageId],
    queryFn: () => getPageVersions(pageId),
    enabled: !!pageId,
  });
}
