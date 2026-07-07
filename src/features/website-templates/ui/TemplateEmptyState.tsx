import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TemplateEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <LayoutTemplate className="mb-4 size-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">No templates found</h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create your first template or import one to get started.
      </p>

      <Button className="mt-6">Create Template</Button>
    </div>
  );
}
