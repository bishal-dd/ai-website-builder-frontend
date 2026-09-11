"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGenerateTemplate } from "@/features/website-templates/hooks/useGenerateTemplate";

export default function ApplyTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const hasApplied = useRef(false);

  const { mutateAsync: applyTemplate } = useGenerateTemplate();

  useEffect(() => {
    if (hasApplied.current) return;

    if (!templateId) {
      toast.error("Template not found");
      router.replace("/dashboard");
      return;
    }

    hasApplied.current = true;

    const apply = async () => {
      try {
        const data = await applyTemplate({ templateId });
        const redirectUrl = `${data.redirectUrl}?setup=true`;

        router.replace(redirectUrl);
      } catch (error) {
        console.error("Failed to use template:", error);

        toast.error("Failed to use template");
        router.replace("/dashboard");
      }
    };

    apply();
  }, [templateId, applyTemplate, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />

        <h1 className="text-lg font-semibold">Creating your website...</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          This will only take a moment.
        </p>
      </div>
    </main>
  );
}
