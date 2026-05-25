import { useRef } from "react";
import Frame from "react-frame-component";
import { Sparkles } from "lucide-react";

import { JsonRenderer } from "@/features/preview/ui/JsonRenderer";
import type {
  WebElement,
  WebsiteData,
} from "@/features/preview/types/webElement";
import type {
  DeviceType,
  PreviewPage,
} from "@/features/preview/types/previewPanel";
import {
  findScripts,
  getIframeWidth,
} from "@/features/preview/utils/previewPanel";

interface PreviewFrameProps {
  device: DeviceType;
  websiteData: WebsiteData;
  currentPage: PreviewPage | undefined;
  currentPageId: string;
  contactPhone: string;
  floatingWhatsappEnabled?: boolean;
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
}

export function PreviewFrame({
  device,
  websiteData,
  currentPage,
  currentPageId,
  contactPhone,
  floatingWhatsappEnabled,
  onUpdateElement,
  onUpdateSharedElement,
}: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  const iframeWidth = getIframeWidth(device);
  const hasContent = currentPage && currentPage.pageContent.length > 0;
  const fontFamily = websiteData.metadata?.font_family || "Inter";
  const encodedFontFamily = fontFamily.replace(/ /g, "+").trim();

  return (
    <div className="flex flex-1 items-center justify-center overflow-auto p-4">
      {hasContent ? (
        <div
          className="overflow-hidden rounded-lg border bg-background shadow-xl"
          style={{ width: iframeWidth, height: "100%" }}
        >
          <Frame
            ref={frameRef}
            key={`${currentPageId}-${device}-${websiteData.metadata?.font_family}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            contentDidMount={() => {
              const iframe = document.querySelector("iframe");
              const doc =
                iframe?.contentDocument || iframe?.contentWindow?.document;

              if (!doc) {
                return;
              }

              const scripts = websiteData.elements.flatMap((page) =>
                findScripts(page.pageContent),
              );

              scripts.forEach((scriptElement) => {
                const script = doc.createElement("script");

                script.type = "text/javascript";
                script.textContent = scriptElement.content || "";

                doc.body.appendChild(script);
              });
            }}
            initialContent={`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />

      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
      />

      <link
        href="https://fonts.googleapis.com/css2?family=${encodedFontFamily}:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <script src="https://cdn.tailwindcss.com"></script>

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@latest/dist/driver.css" />
      <script src="https://cdn.jsdelivr.net/npm/driver.js@latest/dist/driver.js.iife.js"></script>
    </head>
    <body style="font-family: '${fontFamily}', sans-serif;">
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
              floatingWhatsappEnabled={floatingWhatsappEnabled}
            />
          </Frame>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <Sparkles className="mx-auto mb-4 h-10 w-10" />
          Website is loading...
        </div>
      )}
    </div>
  );
}
