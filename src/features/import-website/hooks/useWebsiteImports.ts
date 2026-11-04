import { useQuery } from "@tanstack/react-query";
import { getWebsiteImports } from "../api/getWebsiteImports";

export function useWebsiteImports() {
  return useQuery({
    queryKey: ["website-imports", "list"],
    queryFn: getWebsiteImports,
    staleTime: 30_000,
    retry: false,
  });
}
