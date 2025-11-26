"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  RefreshCw,
  FileText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonRenderer } from "./JsonRenderer";
import type { WebElement, WebsiteData } from "../types/webElement";
import { DomainModal } from "../domain/DomainModal";

type DeviceType = "desktop" | "tablet" | "mobile";

interface PreviewPanelJsonProps {
  websiteData: WebsiteData;
  onUpdateElement?: (
    pageId: string,
    elementId: number,
    updates: Partial<WebElement>
  ) => void;
  onPageChange: (pageId: string) => void;
  currentPageId: string;
}

export function PreviewPanelJson({
  websiteData,
  onUpdateElement,
  onPageChange,
  currentPageId,
}: PreviewPanelJsonProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [key, setKey] = useState(0);
  const [showDomainModal, setShowDomainModal] = useState(false);

  const handleRefresh = () => setKey((prev) => prev + 1);

  const deviceSizes = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-full",
    mobile: "w-[375px] h-full",
  };

  const currentPage = websiteData.elements.find(
    (p) => p.page_id === currentPageId
  );
  const hasContent = currentPage && currentPage.pageContent.length > 0;

  return (
    <div className="flex h-full flex-col bg-muted">
      {/* Header with device tabs and controls */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-foreground">Preview</h3>
          <Tabs
            value={device}
            onValueChange={(v) => setDevice(v as DeviceType)}
          >
            <TabsList>
              <TabsTrigger value="desktop" className="gap-2">
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="tablet" className="gap-2">
                <Tablet className="h-4 w-4" />
                <span className="hidden sm:inline">Tablet</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => setShowDomainModal(true)}>
            Publish
          </Button>
        </div>
      </div>

      {/* Page selection */}
      <div className="border-b border-border bg-card px-6 py-2">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {websiteData.elements.map((page) => (
              <Button
                key={page.id}
                variant={currentPageId === page.id ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page.id)}
                className="gap-2 whitespace-nowrap"
              >
                <FileText className="h-3 w-3" />
                {page.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Preview area */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-6">
        <div
          className={cn(
            "bg-background shadow-2xl transition-all duration-300 rounded-lg overflow-auto border border-border",
            deviceSizes[device],
            device !== "desktop" && "max-h-full"
          )}
        >
          {hasContent ? (
            <div key={key} className="w-full h-full overflow-auto">
              <JsonRenderer
                elements={currentPage.pageContent}
                onUpdateElement={(elementId, updates) =>
                  onUpdateElement?.(currentPageId, elementId, updates)
                }
              />
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">
                  Your Website Preview
                </h2>
                <p className="text-muted-foreground">
                  Start chatting to generate your website. It will appear here
                  in real-time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card px-6 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {hasContent ? `Viewing: ${currentPage?.title}` : "Ready to generate"}
        </span>
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              hasContent ? "bg-green-500" : "bg-yellow-500"
            )}
          ></span>
          {hasContent ? "Live" : "Waiting"}
        </span>
      </div>

      {/* Domain Modal */}
      {showDomainModal && (
        <DomainModal
          onClose={() => setShowDomainModal(false)}
          contact={{
            firstName: "Choedra",
            lastName: "Bhutan",
            email: "choedra@example.com",
            phone: "+9751234567",
            address: "Some Street",
            city: "Thimphu",
            state: "Thimphu",
            zip: "11001",
            country: "BT",
          }}
        />
      )}
    </div>
  );
}
