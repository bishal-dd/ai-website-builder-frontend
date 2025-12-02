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

export default function Preview() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const updatePage = useUpdateWebsitePage();
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    elements: [],
    metadata: {},
  });
  const [currentPageId, setCurrentPageId] = useState<string>("");
  const websiteId = "665d2c87-e0a7-4116-ae21-176dc4e83d54";

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

  const handleUpdateElement = async (
    pageId: string,
    elementId: number,
    updates: Partial<WebElement>,
  ) => {
    const updateElementRecursive = (elements: WebElement[]): WebElement[] => {
      return elements.map((element) => {
        if (element.id === elementId) {
          return { ...element, ...updates };
        }
        if (element.children) {
          return {
            ...element,
            children: updateElementRecursive(element.children),
          };
        }
        return element;
      });
    };

    // Compute new elements first
    const newElements = websiteData.elements.map((page) =>
      page.id === pageId
        ? { ...page, pageContent: updateElementRecursive(page.pageContent) }
        : page,
    );

    // Update state
    setWebsiteData((prev) => ({ ...prev, elements: newElements }));

    // Find the updated page safely
    const updatedPage = newElements.find((el) => el.id === pageId);
    if (!updatedPage) {
      console.error("Page not found", pageId);
      return;
    }

    await updatePage.mutateAsync({
      pageId,
      body: { content: updatedPage },
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        <PreviewPanelJson
          websiteData={websiteData}
          currentPageId={currentPageId}
          onUpdateElement={handleUpdateElement}
          onPageChange={setCurrentPageId}
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
              <ChatPanelJson onClose={() => setIsChatOpen(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
