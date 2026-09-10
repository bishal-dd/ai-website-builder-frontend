import ApplyTemplate from "@/features/website-templates/ui/ApplyTemplate";
import { Suspense } from "react";

function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />

        <h1 className="text-lg font-semibold">Preparing your template...</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          This will only take a moment.
        </p>
      </div>
    </main>
  );
}

export default function ApplyTemplatePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ApplyTemplate />
    </Suspense>
  );
}
