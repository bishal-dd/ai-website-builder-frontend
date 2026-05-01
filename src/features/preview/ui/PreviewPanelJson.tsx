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
  ChevronDown,
  MoveUpRight,
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
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGeneratePreviewWebsite } from "../hooks/useGeneratePreviewWebsite";

type DeviceType = "desktop" | "tablet" | "mobile";

interface PreviewPanelJsonProps {
  websiteId: string;
  websiteData: WebsiteData;
  contactPhone: string;
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
  contactPhone,
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
  const { mutate: generatePreview, isPending: isGeneratingPreview } =
    useGeneratePreviewWebsite();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
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

  const mainPages = sortedPages.filter(
    (p) => !p.page.includes("/") || p.page === "index",
  );

  // 2. Identify "Nested" pages (has a slash like tours/bhutan)
  const nestedPages = sortedPages.filter(
    (p) => p.page.includes("/") && p.page !== "index",
  );

  // 3. Group nested pages by their parent (e.g., "tours", "services")
  const groupedSubPages = nestedPages.reduce(
    (acc, page) => {
      const parent = page.page.split("/")[0];
      if (!acc[parent]) acc[parent] = [];
      acc[parent].push(page);
      return acc;
    },
    {} as Record<string, typeof sortedPages>,
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

  const handleSharePreview = async () => {
    await toast.promise(
      new Promise<void>((resolve, reject) => {
        generatePreview(websiteId, {
          onSuccess: (data) => {
            const previewUrl = `${data.previewUrl}?v=${data.version}`;
            window.open(previewUrl, "_blank", "noopener,noreferrer");
            resolve();
          },
          onError: reject,
        });
      }),
      {
        loading: "Generating preview link...",
        success: "Preview ready!",
        error: "Failed to generate preview",
      },
    );
  };

  return (
    <div className="flex h-screen flex-col bg-muted">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card px-4 py-3">
        <div className="hidden md:flex  items-center gap-2">
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

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Ask for help */}
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm
                       px-2 sm:px-3"
          >
            <a
              href="https://wa.me/97517959259?text=Hi%20I%20need%20help%20with%20my%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Image
                src="/whatsapp-icon.svg"
                alt="WhatsApp"
                width={18}
                height={18}
              />
              <span className="hidden sm:inline text-sm font-medium">
                Ask for help
              </span>
              <span className=" md:hidden sm:inline text-sm font-medium">
                Help?
              </span>
            </a>
          </Button>

          {/* Dashboard */}
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="sm:inline">Dashboard</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={handleSharePreview}
            disabled={isGeneratingPreview}
            className="flex items-center gap-2"
          >
            {isGeneratingPreview ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MoveUpRight className="h-4 w-4" />
            )}
            {isGeneratingPreview ? "Generating preview..." : "Preview"}
          </Button>

          {/* Publish / Republish */}
          {isFetchingData ? (
            <Button disabled variant="outline" className="px-3">
              <span className="hidden sm:inline">Checking status...</span>
              <span className="sm:hidden">…</span>
            </Button>
          ) : isDeployed ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" className="px-3">
                  <span className="hidden sm:inline">Republish</span>
                  <span className="sm:hidden">Republish</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                {" "}
                <AlertDialogHeader>
                  {" "}
                  <AlertDialogTitle>
                    Are you absolutely sure?
                  </AlertDialogTitle>{" "}
                  <AlertDialogDescription>
                    {" "}
                    This will push your latest changes to the live production
                    site. This action cannot be undone.{" "}
                  </AlertDialogDescription>{" "}
                </AlertDialogHeader>{" "}
                <AlertDialogFooter>
                  {" "}
                  <AlertDialogCancel>Cancel</AlertDialogCancel>{" "}
                  <AlertDialogAction
                    onClick={handleRepublish}
                    className="bg-primary text-primary-foreground"
                  >
                    {" "}
                    Confirm Republish{" "}
                  </AlertDialogAction>{" "}
                </AlertDialogFooter>{" "}
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              className="px-3"
              onClick={() => router.push(`/domain/${websiteId}`)}
            >
              <span className="hidden sm:inline">Publish</span>
              <span className="sm:hidden">Publish</span>
            </Button>
          )}
        </div>
      </div>

      {/* Page selector */}
      <div className="border-b bg-card px-4 py-2">
        <ScrollArea>
          <div className="flex gap-2">
            {mainPages.map((mainPage) => {
              const subPages = groupedSubPages[mainPage.page] || [];
              const hasSubPages = subPages.length > 0;
              const isActive =
                currentPageId === mainPage.page_id ||
                subPages.some((sp) => sp.page_id === currentPageId);

              if (hasSubPages) {
                // RENDER DROPDOWN (For Tours, Services, etc.)
                return (
                  <DropdownMenu key={mainPage.page_id}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        className="gap-2"
                      >
                        {/* Icon is now always present for dropdown triggers */}
                        <FileText className="h-3 w-3" />
                        {subPages.find((sp) => sp.page_id === currentPageId)
                          ?.title || mainPage.title}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-60">
                      <DropdownMenuItem
                        onClick={() => onPageChange(mainPage.page_id)}
                      >
                        {mainPage.title} (Overview)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {subPages.map((sub) => (
                        <DropdownMenuItem
                          key={sub.page_id} // Use page_id for keys
                          onClick={() => onPageChange(sub.page_id)}
                        >
                          {sub.title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              // RENDER SIMPLE BUTTON (For Home, About, Contact, etc.)
              return (
                <Button
                  key={mainPage.page_id}
                  size="sm"
                  variant={
                    currentPageId === mainPage.page_id ? "default" : "outline"
                  }
                  onClick={() => onPageChange(mainPage.page_id)}
                >
                  {/* Icon is now rendered for every simple button */}
                  <FileText className="h-3 w-3 mr-1" />
                  {mainPage.title}
                </Button>
              );
            })}
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
              ref={frameRef}
              key={`${currentPageId}-${device}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              initialContent={`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@latest/dist/driver.css" />
      <script src="https://cdn.jsdelivr.net/npm/driver.js@latest/dist/driver.js.iife.js"></script>
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>
`}
            >
              <JsonRenderer
                contactPhone={contactPhone}
                device={device}
                elements={currentPage.pageContent}
                sharedComponents={websiteData.sharedComponents}
                onUpdateElement={(elementId, updates) =>
                  onUpdateElement?.(currentPageId, elementId, updates)
                }
                onUpdateSharedElement={onUpdateSharedElement}
                floatingWhatsappEnabled={freshData?.floating_whatsapp_enabled}
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
