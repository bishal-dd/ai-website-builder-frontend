import { Skeleton } from "@/components/ui/skeleton";

export function TemplateLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border p-4">
          <Skeleton className="aspect-16/10 w-full rounded-lg" />

          <Skeleton className="mt-4 h-5 w-2/3" />

          <Skeleton className="mt-2 h-4 w-1/3" />

          <Skeleton className="mt-6 h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
