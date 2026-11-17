"use client";

import { useMutation } from "@tanstack/react-query";
import { importWebsite } from "../api/importWebsite";
import type { ImportWebsiteResponse } from "../api/importWebsite";

export function useImportWebsite() {
  const mutation = useMutation<ImportWebsiteResponse, Error, File>({
    mutationFn: importWebsite,
    retry: 0,
  });

  return {
    importWebsite: mutation.mutateAsync,
    result: mutation.data,
    isImporting: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
