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
import { useParams } from "next/navigation";
import { DomainModalWrapper } from "@/features/preview/domain/DomainModalWrapper";

export default function Preview() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);

  const updatePage = useUpdateWebsitePage();
  const updateWebsite = useUpdateWebsite();

  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    elements: [],
    sharedComponents: { navbar: [], footer: [] },
    metadata: {},
  });
  const [currentPageId, setCurrentPageId] = useState<string>("");

  const params = useParams();
  const websiteId = params.websiteId as string;

  const { data: generatedWebsite } = useGetGeneratedWebsite(websiteId);

  useEffect(() => {
    if (generatedWebsite) {
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
    updates: Partial<WebElement>
  ): WebElement[] =>
    elements.map((el) =>
      el.id === elementId
        ? { ...el, ...updates }
        : el.children
        ? {
            ...el,
            children: updateElementRecursive(el.children, elementId, updates),
          }
        : el
    );

  const handleUpdateElement = async (
    pageId: string,
    elementId: number,
    updates: Partial<WebElement>
  ) => {
    const newElements = websiteData.elements.map((page) =>
      page.page_id === pageId
        ? {
            ...page,
            pageContent: updateElementRecursive(
              page.pageContent,
              elementId,
              updates
            ),
          }
        : page
    );

    setWebsiteData((prev) => ({ ...prev, elements: newElements }));

    const updatedPage = newElements.find((el) => el.page_id === pageId);
    if (!updatedPage) return console.error("Page not found", pageId);

    await updatePage.mutateAsync({ pageId, body: { content: updatedPage } });
  };

  const handleUpdateSharedElement = async (
    componentKey: "navbar" | "footer",
    elementId: number,
    updates: Partial<WebElement>
  ) => {
    const newSharedComponents = {
      ...websiteData.sharedComponents,
      [componentKey]: updateElementRecursive(
        websiteData.sharedComponents[componentKey],
        elementId,
        updates
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        <PreviewPanelJson
          websiteData={websiteData}
          currentPageId={currentPageId}
          onUpdateElement={handleUpdateElement}
          onUpdateSharedElement={handleUpdateSharedElement}
          onPageChange={setCurrentPageId}
          onPublish={() => setIsDomainModalOpen(true)} // <-- Open modal on publish
        />

        {!isChatOpen && (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}

        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
            <div className="pointer-events-auto h-[600px] w-full max-w-md m-4 rounded-lg shadow-2xl border border-border overflow-hidden">
              <ChatPanelJson
                websiteId={websiteId}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Domain Modal */}
        {isDomainModalOpen && websiteId && (
          <DomainModalWrapper
            websiteId={websiteId}
            onClose={() => setIsDomainModalOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
