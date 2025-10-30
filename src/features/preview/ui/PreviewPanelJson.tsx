"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonRenderer } from "./JsonRenderer";
import type { WebElement } from "../types/webElement";

type DeviceType = "desktop" | "tablet" | "mobile";

interface PreviewPanelJsonProps {
  websiteData: WebElement[];
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
}

export function PreviewPanelJson({
  websiteData,
  onUpdateElement,
}: PreviewPanelJsonProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const deviceSizes = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-full",
    mobile: "w-[375px] h-full",
  };

  const hasContent = websiteData && websiteData.length > 0;

  return (
    <div className="flex h-full flex-col bg-muted">
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
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto p-6">
        <div
          className={cn(
            "bg-background shadow-2xl transition-all duration-300 rounded-lg overflow-auto border border-border",
            deviceSizes[device],
            device !== "desktop" && "max-h-full",
          )}
        >
          {hasContent ? (
            <div key={key} className="w-full h-full overflow-auto">
              <JsonRenderer
                elements={websiteData}
                onUpdateElement={onUpdateElement}
              />
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <svg
                    className="h-10 w-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
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

      <div className="border-t border-border bg-card px-6 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{hasContent ? "Website generated" : "Ready to generate"}</span>
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                hasContent ? "bg-green-500" : "bg-yellow-500",
              )}
            ></span>
            {hasContent ? "Live" : "Waiting"}
          </span>
        </div>
      </div>
    </div>
  );
}
