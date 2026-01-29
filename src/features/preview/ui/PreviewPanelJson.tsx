"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  FileText,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { JsonRenderer } from "./JsonRenderer";
import type { WebElement, WebsiteData } from "../types/webElement";
import { useRouter } from "next/navigation";
import Frame from "react-frame-component";
import { redeployWebsite } from "../api/redeployWebsite";
import useGetGeneratedWebsite from "../hooks/useGetGeneratedWebsite";
import { toast } from "sonner";

type DeviceType = "desktop" | "tablet" | "mobile";

interface PreviewPanelJsonProps {
  websiteId: string;
  websiteData: WebsiteData;
  onUpdateElement?: (
    pageId: string,
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
  onUpdateSharedElement: (
    componentKey: "navbar" | "footer",
    elementId: number,
    updates: Partial<WebElement>,
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
  const router = useRouter();
  const didInitPageRef = useRef(false);

  const { data: freshData, isLoading: isFetchingData } =
    useGetGeneratedWebsite(websiteId);
  const deploymentCount = freshData?.deployment_count ?? 0;
  const isDeployed = deploymentCount > 0;

  useEffect(() => {
    const width = window.innerWidth;
    if (width < 640) setDevice("mobile");
    else if (width < 1024) setDevice("tablet");
    else setDevice("desktop");
  }, []);

  const iframeWidth = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  }[device];

  const currentPage = websiteData.elements.find(
    (p) => p.page_id === currentPageId,
  );

  const sortedPages = [...websiteData.elements].sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
  );

  useEffect(() => {
    if (didInitPageRef.current) return;
    if (!sortedPages.length) return;

    const homePage =
      sortedPages.find((p) => p.sequence === 1) ?? sortedPages[0];

    didInitPageRef.current = true;
    onPageChange(homePage.page_id);
  }, [sortedPages, onPageChange]);

  const hasContent = currentPage && currentPage.pageContent.length > 0;
  const handleRepublish = async () => {
    await toast.promise(redeployWebsite(websiteId), {
      loading: "🚀 Queueing your redeploy...",
      success: "Website redeploy queued successfully!",
      error: (err) => err.message || "Failed to redeploy website",
    });
  };
  return (
    <div className="flex h-screen flex-col bg-muted">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Preview</h3>
          <Tabs
            value={device}
            onValueChange={(v: string) => setDevice(v as DeviceType)}
          >
            <TabsList>
              <TabsTrigger value="desktop">
                <Monitor className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="tablet">
                <Tablet className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="mobile">
                <Smartphone className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <LayoutDashboard className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.refresh()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          {/* THE TOGGLE LOGIC */}
          {/* ... inside your header action area ... */}
          {isFetchingData ? (
            <Button disabled variant="outline">
              Checking status...
            </Button>
          ) : isDeployed ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default">Republish</Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will push your latest changes to the live production
                    site. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRepublish}
                    className="bg-primary text-primary-foreground"
                  >
                    Confirm Republish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button onClick={() => router.push(`/domain/${websiteId}`)}>
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Page selector */}
      <div className="border-b bg-card px-4 py-2">
        <ScrollArea>
          <div className="flex gap-2">
            {sortedPages.map((page) => (
              <Button
                key={page.id}
                size="sm"
                variant={currentPageId === page.page_id ? "default" : "outline"}
                onClick={() => onPageChange(page.page_id)}
              >
                <FileText className="h-3 w-3 mr-1" />
                {page.title}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Preview */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        {hasContent ? (
          <div
            className="bg-background border shadow-xl rounded-lg overflow-hidden"
            style={{ width: iframeWidth, height: "100%" }}
          >
            <Frame
              key={`${currentPageId}-${device}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              initialContent={`
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <script src="https://cdn.tailwindcss.com"></script>
                  </head>
                  <body>
                    <div id="root"></div>
                  </body>
                </html>
              `}
            >
              <JsonRenderer
                device={device}
                elements={currentPage.pageContent}
                sharedComponents={websiteData.sharedComponents}
                onUpdateElement={(elementId, updates) =>
                  onUpdateElement?.(currentPageId, elementId, updates)
                }
                onUpdateSharedElement={onUpdateSharedElement}
              />
            </Frame>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-4 h-10 w-10" />
            Start chatting to generate content
          </div>
        )}
      </div>
    </div>
  );
}
