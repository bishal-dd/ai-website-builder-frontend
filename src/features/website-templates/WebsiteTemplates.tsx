"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useGetAllTemplates } from "./hooks/useGetAllTemplates";
import { useGeneratePreviewTemplate } from "./hooks/useGeneratePreviewTemplate";
import { useGenerateTemplate } from "./hooks/useGenerateTemplate";

import { TemplateGrid } from "./ui/TemplateGrid";
import { TEMPLATE_CATEGORIES } from "./types/categories";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TemplatePreviewDialog } from "./ui/TemplatePreviewDialog";

export function WebsiteTemplates() {
  const { category } = useParams<{ category: string }>();
  const router = useRouter();

  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(
    null,
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [previewTitle, setPreviewTitle] = useState<string>();

  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null,
  );

  const { templates, isLoading, error } = useGetAllTemplates({
    category,
  });

  const { mutate: generateTemplatePreview } = useGeneratePreviewTemplate();
  const { mutate: applyTemplate } = useGenerateTemplate();
  const handlePreview = (templateId: string) => {
    const template = templates.find((template) => template.id === templateId);

    setPreviewTitle(template?.name);
    setPreviewOpen(true);
    setPreviewUrl(undefined);
    setPreviewTemplateId(templateId);

    setLoadingTemplateId(templateId);

    generateTemplatePreview(templateId, {
      onSuccess: (data) => {
        setPreviewUrl(`${data.previewUrl}?v=${data.version}`);
        setLoadingTemplateId(null);
      },

      onError: () => {
        setLoadingTemplateId(null);
        setPreviewOpen(false);
        setPreviewTemplateId(null);

        toast.error("Failed to generate preview");
      },
    });
  };

  const handleUseTemplate = (templateId: string) => {
    setLoadingTemplateId(templateId);

    toast.promise(
      new Promise<void>((resolve, reject) => {
        applyTemplate(
          { templateId },
          {
            onSuccess: (data) => {
              setLoadingTemplateId(null);
              router.replace(`${data.redirectUrl}?setup=true`);
              resolve();
            },
            onError: (err) => {
              setLoadingTemplateId(null);
              reject(err);
            },
          },
        );
      }),
      {
        loading: "Creating your website...",
        success: "Template applied!",
        error: "Failed to use template",
      },
    );
  };

  if (isLoading) {
    return <div className="p-8">Loading templates...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Failed to load templates</div>;
  }

  const categoryInfo = TEMPLATE_CATEGORIES.find((c) => c.id === category);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger className="-ml-2" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {categoryInfo?.title} Templates
              </h1>

              <p className="text-sm text-muted-foreground">
                Pick a template and customize everything later.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {templates.length} Templates
            </p>
          </div>
        </div>

        <TemplateGrid
          templates={templates}
          onPreview={handlePreview}
          onUse={handleUseTemplate}
          loadingTemplateId={loadingTemplateId}
        />
      </main>

      <TemplatePreviewDialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);

          if (!open) {
            setPreviewUrl(undefined);
            setPreviewTitle(undefined);
            setPreviewTemplateId(null);
          }
        }}
        previewUrl={previewUrl}
        title={previewTitle}
        isLoading={
          loadingTemplateId === previewTemplateId && previewTemplateId !== null
        }
        onUseTemplate={() => {
          if (previewTemplateId) {
            handleUseTemplate(previewTemplateId);
          }
        }}
      />
    </div>
  );
}
