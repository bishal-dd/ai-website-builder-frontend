// src/app/Preview.tsx

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

export default function Preview() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const updatePage = useUpdateWebsitePage();
  const updateWebsite = useUpdateWebsite();
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    elements: [],
    sharedComponents: { navbar: [], footer: [] }, // <-- Initialize sharedComponents
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
    // 1. Compute new elements first
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

    // 2. Update state
    setWebsiteData((prev) => ({ ...prev, elements: newElements }));

    // 3. Find the updated page safely for persistence
    const updatedPage = newElements.find((el) => el.page_id === pageId);
    if (!updatedPage) {
      console.error("Page not found", pageId);
      return;
    }

    await updatePage.mutateAsync({
      pageId,
      body: { content: updatedPage },
    });
  };

  // ** NEW FUNCTION: Handles updates for Navbar/Footer **
  const handleUpdateSharedElement = async (
    componentKey: "navbar" | "footer",
    elementId: number,
    updates: Partial<WebElement>,
  ) => {
    // 1. Compute new shared components
    const newSharedComponents = {
      ...websiteData.sharedComponents,
      [componentKey]: updateElementRecursive(
        websiteData.sharedComponents[componentKey],
        elementId,
        updates,
      ),
    };

    // 2. Update state
    setWebsiteData((prev) => ({
      ...prev,
      sharedComponents: newSharedComponents,
    }));

    await updateWebsite.mutateAsync({
      websiteId,
      body: { shared_components: newSharedComponents },
    });

    // NOTE: In a real app, you would add logic here to call a separate API
    // endpoint to persist the shared component changes to the database.
    console.log(
      `Updated shared component ${componentKey} element ${elementId}`,
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        <PreviewPanelJson
          websiteData={websiteData}
          currentPageId={currentPageId}
          onUpdateElement={handleUpdateElement}
          onUpdateSharedElement={handleUpdateSharedElement} // <-- Pass new handler
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
