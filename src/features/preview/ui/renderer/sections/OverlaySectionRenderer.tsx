import { cn } from "@/lib/utils";

import type { BaseRendererProps } from "../shared/rendererTypes";
import { findBackgroundImage } from "../image/imageUtils";

export function OverlaySectionRenderer({
  element,
  componentKey,
  renderElement,
  fileInputRefs,
  uploadingImageId,
  onImageChange,
}: BaseRendererProps) {
  const { id, class: className, children } = element;

  const bgImage = findBackgroundImage(children, "overlay-bg");
  const isUploading = bgImage && uploadingImageId === bgImage.id;

  return (
    <section key={id} className={cn("relative", className)}>
      {bgImage && renderElement(bgImage, componentKey)}

      {isUploading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 text-white">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span className="text-sm">Uploading...</span>
          </div>
        </div>
      )}

      <>
        {children
          ?.filter((child) => child !== bgImage)
          .map((child) => renderElement(child, componentKey))}
      </>

      {bgImage && (
        <>
          <button
            onClick={(event) => {
              event.stopPropagation();

              if (!isUploading) {
                fileInputRefs.current[`overlay-${id}`]?.click();
              }
            }}
            className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
          >
            {isUploading ? "Uploading..." : "Change Background"}
          </button>

          <input
            ref={(input) => {
              fileInputRefs.current[`overlay-${id}`] = input;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={Boolean(isUploading)}
            onChange={(event) => {
              onImageChange(event, bgImage.id, componentKey);
            }}
          />
        </>
      )}
    </section>
  );
}
