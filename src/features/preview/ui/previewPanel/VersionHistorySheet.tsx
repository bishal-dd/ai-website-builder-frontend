"use client";

import { useState } from "react";
import { History, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { usePageVersions } from "@/features/preview/hooks/usePageVersions";
import { useRollbackPageVersion } from "@/features/preview/hooks/useRollbackPageVersion";

interface VersionHistorySheetProps {
  pageId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VersionHistorySheet({
  pageId,
  open,
  onOpenChange,
}: VersionHistorySheetProps) {
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(
    null,
  );

  const { data: versions, isLoading, isError } = usePageVersions(pageId);

  const rollbackMutation = useRollbackPageVersion();

  const handleRollback = (versionId: string, versionNumber: number) => {
    setRestoringVersionId(versionId);

    rollbackMutation.mutate(
      {
        pageId,
        versionId,
      },
      {
        onSuccess: () => {
          toast.success(`Version ${versionNumber} restored successfully`);

          setRestoringVersionId(null);
          onOpenChange(false);
        },

        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to restore version",
          );

          setRestoringVersionId(null);
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version history
          </SheetTitle>

          <SheetDescription>
            View previous versions of this page and restore an earlier version.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          {isError && (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              Failed to load version history.
            </div>
          )}
          {!isLoading && !isError && (!versions || versions.length === 0) && (
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              No version history available.
            </div>
          )}
          {!isLoading && !isError && versions && versions.length > 0 && (
            <div className="space-y-3">
              {versions.map((version) => {
                const latestVersionNumber = versions[0]?.versionNumber;

                const isCurrentVersion =
                  version.versionNumber === latestVersionNumber;

                const isRestoring = restoringVersionId === version.id;

                return (
                  <div
                    key={version.id}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {isCurrentVersion && (
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                          )}

                          <p className="text-sm font-medium">
                            Version {version.versionNumber}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {isCurrentVersion
                            ? "Current version"
                            : new Date(version.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {!isCurrentVersion && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={rollbackMutation.isPending}
                          onClick={() =>
                            handleRollback(version.id, version.versionNumber)
                          }
                          className="shrink-0"
                        >
                          {isRestoring ? (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="mr-2 h-3.5 w-3.5" />
                          )}

                          {isRestoring ? "Restoring..." : "Restore"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
