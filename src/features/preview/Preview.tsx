"use client";

import { useState, useEffect } from "react";
import { ChatPanelJson } from "./ui/ChatPanelJson";
import { PreviewPanelJson } from "./ui/PreviewPanelJson";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import type {
  WebElement,
  WebsiteData,
  WebPages,
} from "@/features/preview/types/webElement";

export default function Preview() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    elements: [],
    metadata: {},
  });
  const [currentPageId, setCurrentPageId] = useState<number>(1);

  const handleWebsiteGenerated = (data: WebsiteData) => {
    console.log(data);
    setWebsiteData(data);
    if (data.elements.length > 0) {
      setCurrentPageId(data.elements[0].id);
    }
  };

  const handlePageAdded = (page: WebPages) => {
    setWebsiteData((prev) => ({
      ...prev,
      elements: [...prev.elements, page],
    }));
    setCurrentPageId(page.id);
  };

  const handleUpdateElement = (
    pageId: number,
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

    setWebsiteData((prev) => ({
      ...prev,
      elements: prev.elements.map((page) =>
        page.id === pageId
          ? { ...page, pageContent: updateElementRecursive(page.pageContent) }
          : page,
      ),
    }));
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
              <ChatPanelJson
                onClose={() => setIsChatOpen(false)}
                onWebsiteGenerated={handleWebsiteGenerated}
                onPageAdded={handlePageAdded}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
