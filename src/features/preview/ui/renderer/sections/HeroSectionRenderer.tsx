import { cn } from "@/lib/utils";

import type { BaseRendererProps } from "../shared/rendererTypes";
import { findBackgroundImage } from "../image/imageUtils";

export function HeroSectionRenderer({
  element,
  componentKey,
  renderElement,
  fileInputRefs,
  uploadingImageId,
  onImageChange,
}: BaseRendererProps) {
  const { id, class: className, children } = element;

  const bgImage = findBackgroundImage(children, "carousel-bg");
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

      <button
        data-tour="hero-background"
        onClick={(event) => {
          event.stopPropagation();

          if (!isUploading) {
            fileInputRefs.current[`hero-${id}`]?.click();
          }
        }}
        className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
      >
        {isUploading ? "Uploading..." : "Change Background"}
      </button>

      <input
        ref={(input) => {
          fileInputRefs.current[`hero-${id}`] = input;
        }}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={Boolean(isUploading)}
        onChange={(event) => {
          if (bgImage) {
            onImageChange(event, bgImage.id, componentKey);
          }
        }}
      />
    </section>
  );
}
