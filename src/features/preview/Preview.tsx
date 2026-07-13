"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import posthog from "posthog-js";

import { Button } from "@/components/ui/button";
import type {
  WebElement,
  WebsiteData,
} from "@/features/preview/types/webElement";
import useGetGeneratedWebsite from "@/features/preview/hooks/useGetGeneratedWebsite";
import useUpdateWebsite from "@/features/preview/hooks/useUpdateWebsite";
import useUpdateWebsitePage from "@/features/preview/hooks/useUpdateWebsitePage";
import { usePreviewOnboardingTour } from "@/features/preview/hooks/usePreviewOnboardingTour";
import { mapApiToWebsiteData } from "@/features/preview/utils/mapApiToWebsiteData";
import { updateElementRecursive } from "@/features/preview/utils/previewElements";
import useReorderPageSections from "@/features/preview/hooks/useReorderPageSections";
import { ChatPanelJson } from "./ui/ChatPanelJson";
import { PreviewPanelJson } from "./ui/PreviewPanelJson";
import { WebsiteSetupModal } from "../website-templates/ui/WebsiteSetupModal";

export default function Preview() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contactPhone, setContactPhone] = useState<string>("");
  const [currentPageId, setCurrentPageId] = useState<string>("");
  const [showWebsiteSetup, setShowWebsiteSetup] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    elements: [],
    sharedComponents: {
      navbar: [],
      footer: [],
    },
    metadata: {},
  });
  const reorderPageSections = useReorderPageSections();

  const params = useParams();
  const websiteId = params.websiteId as string;

  const updatePage = useUpdateWebsitePage();
  const updateWebsite = useUpdateWebsite();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldShowSetup = searchParams.get("setup") === "true";

  const { data: generatedWebsite } = useGetGeneratedWebsite(websiteId);

  const [hasOpenedSetup, setHasOpenedSetup] = useState(false);

  useEffect(() => {
    if (shouldShowSetup && generatedWebsite && !hasOpenedSetup) {
      setShowWebsiteSetup(true);
      setHasOpenedSetup(true);

      router.replace(`/preview/${websiteId}`);
    }
  }, [shouldShowSetup, generatedWebsite, hasOpenedSetup, router, websiteId]);

  const handleFinishOnboardingTour = useCallback(() => {
    updateWebsite.mutate({
      websiteId,
      body: {
        is_congrats_modal_shown: true,
      },
    });
  }, [updateWebsite, websiteId]);

  usePreviewOnboardingTour({
    websiteId,
    hasGeneratedWebsite: Boolean(generatedWebsite),
    hasWebsiteElements: websiteData.elements.length > 0,
    hasSeenTour: generatedWebsite?.is_congrats_modal_shown,
    onFinish: handleFinishOnboardingTour,
  });

  const handleReorderSections = async (
    pageId: string,
    reorderedSections: WebElement[],
  ) => {
    setWebsiteData((prev) => ({
      ...prev,
      elements: prev.elements.map((page) =>
        page.page_id === pageId
          ? {
              ...page,
              pageContent: reorderedSections,
            }
          : page,
      ),
    }));

    await reorderPageSections.mutateAsync({
      pageId,
      sectionIds: reorderedSections.map((section) => section.id),
    });
  };

  const handleWebsiteGenerated = useCallback((data: WebsiteData) => {
    setWebsiteData(data);

    setCurrentPageId((prev) => {
      const pageStillExists = data.elements.some(
        (page) => page.page_id === prev,
      );

      if (pageStillExists) {
        return prev;
      }

      return data.elements[0]?.page_id || "";
    });
  }, []);

  useEffect(() => {
    if (!generatedWebsite) return;

    setContactPhone(generatedWebsite.contact_phone ?? "");

    const websiteDataFormatted = mapApiToWebsiteData(generatedWebsite);

    handleWebsiteGenerated(websiteDataFormatted);
  }, [generatedWebsite, handleWebsiteGenerated]);

  const handleUpdateElement = async (
    pageId: string,
    elementId: number,
    updates: Partial<WebElement>,
  ) => {
    const newElements = websiteData.elements.map((page) =>
      page.page_id === pageId
        ? {
            ...page,
            pageContent: updateElementRecursive(
              page.pageContent,
              elementId,
              updates,
            ),
          }
        : page,
    );

    setWebsiteData((prev) => ({
      ...prev,
      elements: newElements,
    }));

    const updatedPage = newElements.find((page) => page.page_id === pageId);

    if (!updatedPage) {
      console.error("Page not found", pageId);
      return;
    }

    await updatePage.mutateAsync({
      pageId,
      body: {
        content: updatedPage,
      },
    });
  };

  const handleUpdateSharedElement = async (
    componentKey: "navbar" | "footer",
    elementId: number,
    updates: Partial<WebElement>,
  ) => {
    const newSharedComponents = {
      ...websiteData.sharedComponents,
      [componentKey]: updateElementRecursive(
        websiteData.sharedComponents[componentKey],
        elementId,
        updates,
      ),
    };

    setWebsiteData((prev) => ({
      ...prev,
      sharedComponents: newSharedComponents,
    }));

    await updateWebsite.mutateAsync({
      websiteId,
      body: {
        shared_components: newSharedComponents,
      },
    });
  };

  const sortedPages = [...websiteData.elements].sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
  );

  const handleOpenAiHelper = () => {
    posthog.capture("ai_chat_opened", {
      website_id: websiteId,
      current_page_id: currentPageId,
    });

    setIsChatOpen(true);
  };

  const handleWebsiteSetup = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    updateWebsite.mutate(
      {
        websiteId,
        body: {
          title: title,
          description,
        },
      },
      {
        onSuccess: () => {
          setShowWebsiteSetup(false);
        },
      },
    );
  };
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <main className="relative flex-1 overflow-hidden">
        <PreviewPanelJson
          contactPhone={contactPhone}
          websiteId={websiteId}
          websiteData={websiteData}
          currentPageId={currentPageId}
          onUpdateElement={handleUpdateElement}
          onUpdateSharedElement={handleUpdateSharedElement}
          onPageChange={setCurrentPageId}
          onReorderSections={handleReorderSections}
        />

        {!isChatOpen && (
          <Button
            data-tour="ai-helper"
            onClick={handleOpenAiHelper}
            className="fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2 rounded-full px-4 shadow-lg transition-all hover:shadow-xl"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-sm font-medium">AI Helper</span>
          </Button>
        )}

        {isChatOpen && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-end">
            <div className="pointer-events-auto m-4 h-157.5 w-full max-w-md overflow-hidden rounded-lg border border-border shadow-2xl">
              <ChatPanelJson
                currentPageId={currentPageId}
                pages={sortedPages}
                websiteId={websiteId}
                font={websiteData.metadata?.font_family}
                onClose={() => setIsChatOpen(false)}
                websiteType={websiteData.metadata?.type}
              />
            </div>
          </div>
        )}
      </main>

      <WebsiteSetupModal
        open={showWebsiteSetup}
        onOpenChange={setShowWebsiteSetup}
        onSubmit={handleWebsiteSetup}
      />
    </div>
  );
}
