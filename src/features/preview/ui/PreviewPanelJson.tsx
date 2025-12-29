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
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonRenderer } from "./JsonRenderer";
import type { WebElement, WebsiteData } from "../types/webElement";
import { useRouter } from "next/navigation";

type DeviceType = "desktop" | "tablet" | "mobile";

interface PreviewPanelJsonProps {
  websiteId: string;
  websiteData: WebsiteData;
  onUpdateElement?: (
    pageId: string,
    elementId: number,
    updates: Partial<WebElement>
  ) => void;
  onUpdateSharedElement: (
    componentKey: "navbar" | "footer",
    elementId: number,
    updates: Partial<WebElement>
  ) => void;
  onPageChange: (pageId: string) => void;
  currentPageId: string;
}

export function PreviewPanelJson({
  websiteId,
  websiteData,
  onUpdateElement,
  onUpdateSharedElement,
  onPageChange,
  currentPageId,
}: PreviewPanelJsonProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [key, setKey] = useState(0);
  const router = useRouter();

  const handleRefresh = () => setKey((prev) => prev + 1);

  const deviceSizes = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-full",
    mobile: "w-[375px] h-full",
  };

  const currentPage = websiteData.elements.find(
    (p) => p.page_id === currentPageId
  );
  const sortedPages = [...websiteData.elements].sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)
  );
  const hasContent = currentPage && currentPage.pageContent.length > 0;

  return (
    <div className="flex h-screen flex-col bg-muted">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground">Preview</h3>
          <Tabs
            value={device}
            onValueChange={(v) => setDevice(v as DeviceType)}
          >
            <TabsList className="flex-wrap gap-1">
              <TabsTrigger value="desktop" className="gap-1">
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="tablet" className="gap-1">
                <Tablet className="h-4 w-4" />
                <span className="hidden sm:inline">Tablet</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="gap-1">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-1 mt-2 sm:mt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Button>

          <div className="mx-1 h-6 w-px bg-border" />

          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button size="sm" onClick={() => router.push(`/domain/${websiteId}`)}>
            Publish
          </Button>
        </div>
      </div>

      {/* Page selection */}
      <div className="border-b border-border bg-card px-4 py-2">
        <ScrollArea className="w-full max-h-20">
          <div className="flex gap-2 pb-2 flex-wrap">
            {sortedPages.map((page) => (
              <Button
                key={page.id}
                variant={currentPageId === page.page_id ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page.page_id)}
                className="gap-1 whitespace-nowrap"
              >
                <FileText className="h-3 w-3" />
                {page.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Preview area */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
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
                sharedComponents={websiteData.sharedComponents}
                onUpdateElement={(elementId, updates) =>
                  onUpdateElement?.(currentPageId, elementId, updates)
                }
                onUpdateSharedElement={onUpdateSharedElement}
              />
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center p-4">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-1 text-xl font-bold text-foreground">
                  Your Website Preview
                </h2>
                <p className="text-muted-foreground text-sm">
                  Start chatting to generate your website. It will appear here
                  in real-time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card px-4 py-2 flex items-center justify-between text-xs text-muted-foreground flex-wrap">
        <span>
          {hasContent ? `Viewing: ${currentPage?.title}` : "Ready to generate"}
        </span>
        <span className="flex items-center gap-2 mt-1 sm:mt-0">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              hasContent ? "bg-green-500" : "bg-yellow-500"
            )}
          />
          {hasContent ? "Live" : "Waiting"}
        </span>
      </div>
    </div>
  );
}
