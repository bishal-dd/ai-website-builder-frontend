"use client";

import { useState, useEffect } from "react";
import { ChatPanelJson } from "./ui/ChatPanelJson";
import { PreviewPanelJson } from "./ui/PreviewPanelJson";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import type { WebElement } from "@/features/preview/types/webElement";
import { sample } from "@/features/preview/constants/sampleJsonWebsite";

export default function Preview() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebElement[]>([]);

  const handleWebsiteGenerated = (elements: WebElement[]) => {
    setWebsiteData(elements);
  };

  const handleUpdateElement = (id: number, updates: Partial<WebElement>) => {
    const updateElementRecursive = (elements: WebElement[]): WebElement[] => {
      return elements.map((element) => {
        if (element.id === id) {
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

    setWebsiteData((prev) => updateElementRecursive(prev));
  };

  useEffect(() => {
    setWebsiteData(sample);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        <PreviewPanelJson
          websiteData={websiteData}
          onUpdateElement={handleUpdateElement}
        />

        {!isChatOpen && (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all"
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
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
