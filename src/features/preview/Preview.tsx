"use client";

import { useEffect, useState } from "react";
import { ChatPanelJson } from "./ui/ChatPanelJson";
import { PreviewPanelJson } from "./ui/PreviewPanelJson";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import type {
  WebElement,
  WebsiteData,
} from "@/features/preview/types/webElement";
import useGetGeneratedWebsite from "@/features/preview/hooks/useGetGeneratedWebsite";
import { mapApiToWebsiteData } from "@/features/preview/utils/mapApiToWebsiteData";
import useUpdateWebsitePage from "./hooks/useUpdateWebsitePage";
import useUpdateWebsite from "@/features/preview/hooks/useUpdateWebsite";
import { useParams, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import ShareCongratsModal from "./ui/ShareCongratsModal";

export default function Preview() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const updatePage = useUpdateWebsitePage();
  const updateWebsite = useUpdateWebsite();
  const [contactPhone, setContactPhone] = useState<string>("");
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    elements: [],
    sharedComponents: { navbar: [], footer: [] },
    metadata: {},
  });
  const [currentPageId, setCurrentPageId] = useState<string>("");

  const searchParams = useSearchParams();
  const params = useParams();
  const websiteId = params.websiteId as string;

  const { data: generatedWebsite } = useGetGeneratedWebsite(websiteId);

  const isFirstLoad = searchParams.get("firstLoad") === "true";

  useEffect(() => {
    if (!generatedWebsite || showCongratsModal) return;

    const { is_congrats_modal_shown } = generatedWebsite;
    const shouldShow = !is_congrats_modal_shown || isFirstLoad;

    if (shouldShow) {
      setShowCongratsModal(true);

      if (!is_congrats_modal_shown) {
        updateWebsite.mutate({
          websiteId,
          body: { is_congrats_modal_shown: true },
        });
      }

      if (isFirstLoad) {
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [
    generatedWebsite,
    showCongratsModal,
    isFirstLoad,
    websiteId,
    updateWebsite,
  ]);
  useEffect(() => {
    if (generatedWebsite) {
      setContactPhone(generatedWebsite.contact_phone ?? "");
      const websiteDataFormatted = mapApiToWebsiteData(generatedWebsite);
      handleWebsiteGenerated(websiteDataFormatted);
    }
  }, [generatedWebsite]);

  const handleWebsiteGenerated = (data: WebsiteData) => {
    setWebsiteData(data);
    if (data.elements.length > 0) {
      setCurrentPageId(data.elements[0].page_id);
    }
  };

  const updateElementRecursive = (
    elements: WebElement[],
    elementId: number,
    updates: Partial<WebElement>,
  ): WebElement[] => {
    return elements.map((element) => {
      if (element.id === elementId) {
        return { ...element, ...updates };
      }
      if (element.children) {
        return {
          ...element,
          children: updateElementRecursive(
            element.children,
            elementId,
            updates,
          ),
        };
      }
      return element;
    });
  };

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

    setWebsiteData((prev) => ({ ...prev, elements: newElements }));

    const updatedPage = newElements.find((el) => el.page_id === pageId);
    if (!updatedPage) return console.error("Page not found", pageId);

    await updatePage.mutateAsync({ pageId, body: { content: updatedPage } });
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
      body: { shared_components: newSharedComponents },
    });
  };

  const sortedPages = [...websiteData.elements].sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        <PreviewPanelJson
          contactPhone={contactPhone}
          websiteId={websiteId}
          websiteData={websiteData}
          currentPageId={currentPageId}
          onUpdateElement={handleUpdateElement}
          onUpdateSharedElement={handleUpdateSharedElement}
          onPageChange={setCurrentPageId}
        />

        {/* Congrats modal */}
        {showCongratsModal && generatedWebsite && (
          <ShareCongratsModal
            open={showCongratsModal}
            websiteId={websiteId}
            onContinue={() => setShowCongratsModal(false)}
            onClose={() => setShowCongratsModal(false)}
          />
        )}
        {!isChatOpen && (
          <Button
            onClick={() => {
              // Capture AI chat opened event
              posthog.capture("ai_chat_opened", {
                website_id: websiteId,
                current_page_id: currentPageId,
              });
              setIsChatOpen(true);
            }}
            className="fixed bottom-6 right-6 z-50 h-14 px-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-sm font-medium">AI Helper</span>
          </Button>
        )}

        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
            <div className="pointer-events-auto h-[600px] w-full max-w-md m-4 rounded-lg shadow-2xl border border-border overflow-hidden">
              <ChatPanelJson
                currentPageId={currentPageId}
                pages={sortedPages}
                websiteId={websiteId}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
