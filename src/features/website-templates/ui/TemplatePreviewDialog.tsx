"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl?: string;
  title?: string;
  onUseTemplate?: () => void;
  isLoading?: boolean;
}

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  previewUrl,
  title,
  onUseTemplate,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          flex
          h-[90vh]
          w-[95vw]
          max-w-[95vw]
          sm:max-w-[95vw] 
          md:max-w-[95vw] 
          flex-col
          overflow-hidden
          p-0
        "
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 shrink-0 border-b px-6 py-4 pr-14 gap-4">
          <DialogTitle className="truncate">
            {title ?? "Template Preview"}
          </DialogTitle>

          {onUseTemplate && (
            <Button
              onClick={onUseTemplate}
              disabled={isLoading}
              className="shrink-0"
            >
              {isLoading ? "Creating..." : "Use Template"}
            </Button>
          )}
        </DialogHeader>

        <div className="min-h-0 flex-1">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              title="Website Preview"
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Generating preview...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
