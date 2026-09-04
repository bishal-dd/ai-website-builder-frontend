"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { redeployWebsite } from "../api/redeployWebsite";
import useDeletePage from "../hooks/useDeletePage";
import { useGeneratePreviewWebsite } from "../hooks/useGeneratePreviewWebsite";
import useGetGeneratedWebsite from "../hooks/useGetGeneratedWebsite";

import {
  getGroupedPreviewPages,
  getInitialPreviewPage,
} from "@/features/preview/utils/previewPanel";

import { PreviewHeader } from "@/features/preview/ui/previewPanel/PreviewHeader";
import { PageSelector } from "@/features/preview/ui/previewPanel/PageSelector";
import { PreviewFrame } from "@/features/preview/ui/previewPanel/PreviewFrame";

import type {
  DeviceType,
  PreviewPanelJsonProps,
} from "@/features/preview/types/previewPanel";
import { useCreateTemplateFromWebsite } from "@/features/website-templates/hooks/useCreateTemplateFromWebsite";
import { CreateTemplateDialog } from "@/features/website-templates/ui/CreateTemplateDialog";

export function PreviewPanelJson({
  websiteId,
  websiteData,
  contactPhone,
  isAdmin,
  onUpdateElement,
  onUpdateSharedElement,
  onPageChange,
  onReorderSections,
  onDeleteSection,
  currentPageId,
  onDeviceChange,
  onFontSizeChange,
}: PreviewPanelJsonProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");

  const router = useRouter();
  const didInitPageRef = useRef(false);

  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] =
    useState(false);

  const { data: freshData, isLoading: isFetchingData } =
    useGetGeneratedWebsite(websiteId);

  const { mutate: generatePreview, isPending: isGeneratingPreview } =
    useGeneratePreviewWebsite();

  const { mutate: deletePageMutation, isPending: isDeletingPage } =
    useDeletePage();

  const deploymentCount = freshData?.deployment_count ?? 0;
  const isDeployed = deploymentCount > 0;

  const createTemplateMutation = useCreateTemplateFromWebsite();

  const { sortedPages, mainPages, groupedSubPages } = getGroupedPreviewPages(
    websiteData.elements,
  );

  const currentPage = websiteData.elements.find(
    (page) => page.page_id === currentPageId,
  );

  useEffect(() => {
    const width = window.innerWidth;

    if (width < 640) {
      setDevice("mobile");
      return;
    }

    if (width < 1024) {
      setDevice("tablet");
      return;
    }

    setDevice("desktop");
  }, []);

  useEffect(() => {
    if (didInitPageRef.current) {
      return;
    }

    if (!sortedPages.length) {
      return;
    }

    const homePage = getInitialPreviewPage(sortedPages);

    didInitPageRef.current = true;
    onPageChange(homePage.page_id);
  }, [sortedPages, onPageChange]);

  const handleRepublish = async () => {
    await toast.promise(redeployWebsite(websiteId), {
      loading: "🚀 Queueing your redeploy...",
      success: "Website redeploy queued successfully!",
      error: (err) => err.message || "Failed to redeploy website",
    });
  };

  const handleSharePreview = async () => {
    await toast.promise(
      new Promise<void>((resolve, reject) => {
        generatePreview(websiteId, {
          onSuccess: (data) => {
            const previewUrl = `${data.previewUrl}?v=${data.version}`;

            window.open(previewUrl, "_blank", "noopener,noreferrer");
            resolve();
          },
          onError: reject,
        });
      }),
      {
        loading: "Generating preview link...",
        success: "Preview ready!",
        error: "Failed to generate preview",
      },
    );
  };

  const handleDeletePage = (pageId: string) => {
    const pageToDelete = sortedPages.find((page) => page.page_id === pageId);

    const parentPageSlug = pageToDelete?.page.includes("/")
      ? pageToDelete.page.split("/")[0]
      : null;

    const parentPage = parentPageSlug
      ? sortedPages.find((page) => page.page === parentPageSlug)
      : null;

    deletePageMutation(
      {
        pageId,
        websiteId,
      },
      {
        onSuccess: (res) => {
          if (!res.success) {
            toast.error(res.error || "Failed to delete page");
            return;
          }

          toast.success("Page deleted successfully");

          if (currentPageId !== pageId) {
            return;
          }

          if (parentPage) {
            onPageChange(parentPage.page_id);
            return;
          }

          const fallbackPage = sortedPages.find(
            (page) => page.page_id !== pageId,
          );

          if (fallbackPage) {
            onPageChange(fallbackPage.page_id);
          }
        },

        onError: () => {
          toast.error("Failed to delete page");
        },
      },
    );
  };

  const handleOpenCreateTemplateDialog = () => {
    setCreateTemplateDialogOpen(true);
  };
  const handleCreateTemplate = () => {
    createTemplateMutation.mutate(
      {
        websiteId,
      },
      {
        onSuccess: () => {
          toast.success("Template created successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create template");
        },
      },
    );
  };

  const previewWebsiteData = {
    ...websiteData,
    primary_color: freshData?.primary_color ?? websiteData.primary_color,
    font_family: freshData?.font_family ?? websiteData.metadata?.font_family,
  };

  return (
    <div className="flex h-screen flex-col bg-muted">
      <PreviewHeader
        device={device}
        isFetchingData={isFetchingData}
        isDeployed={isDeployed}
        isGeneratingPreview={isGeneratingPreview}
        isAdmin={isAdmin}
        onDeviceChange={(newDevice) => {
          setDevice(newDevice);
          onDeviceChange?.(newDevice);
        }}
        onSharePreview={handleSharePreview}
        onRepublish={handleRepublish}
        onPublish={() => router.push(`/domain/${websiteId}`)}
        onCreateTemplate={handleOpenCreateTemplateDialog}
      />

      <PageSelector
        mainPages={mainPages}
        groupedSubPages={groupedSubPages}
        currentPageId={currentPageId}
        isDeletingPage={isDeletingPage}
        onPageChange={onPageChange}
        onDeletePage={handleDeletePage}
      />

      <PreviewFrame
        device={device}
        websiteData={previewWebsiteData}
        currentPage={currentPage}
        currentPageId={currentPageId}
        contactPhone={contactPhone}
        floatingWhatsappEnabled={freshData?.floating_whatsapp_enabled}
        onUpdateElement={onUpdateElement}
        onUpdateSharedElement={onUpdateSharedElement}
        onReorderSections={onReorderSections}
        onDeleteSection={onDeleteSection}
        onFontSizeChange={onFontSizeChange}
      />

      <CreateTemplateDialog
        open={createTemplateDialogOpen}
        onOpenChange={setCreateTemplateDialogOpen}
        websiteName={freshData?.title ?? "this website"}
        onConfirm={handleCreateTemplate}
        loading={createTemplateMutation.isPending}
      />
    </div>
  );
}
