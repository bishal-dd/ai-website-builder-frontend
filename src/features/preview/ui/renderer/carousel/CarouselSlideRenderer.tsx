import { cn } from "@/lib/utils";
import { useRendererStore } from "@/features/preview/stores/useRendererStore";

import type { BaseRendererProps } from "../shared/rendererTypes";

export function CarouselSlideRenderer({
  element,
  componentKey,
  renderElement,
  fileInputRefs,
  onImageChange,
}: BaseRendererProps) {
  const { id, class: className, children } = element;

  const activeImageId = useRendererStore((state) => state.activeImageId);
  const setActiveImageId = useRendererStore((state) => state.setActiveImageId);

  const getCarouselBackgroundImage = () => {
    return children?.find(
      (child) =>
        child.tag === "img" &&
        child.attributes?.["data-role"] === "carousel-bg",
    );
  };

  return (
    <div key={id} className={cn("w-full h-full", className)}>
      {children?.map((child) => renderElement(child, componentKey))}

      <button
        onClick={(event) => {
          event.stopPropagation();

          const bgImage = getCarouselBackgroundImage();

          if (!bgImage) return;

          if (activeImageId !== bgImage.id) {
            setActiveImageId(bgImage.id);
          }

          fileInputRefs.current[String(id)]?.click();
        }}
        className="absolute top-4 right-4 z-50 bg-yellow-400 text-black px-4 py-2 rounded-md shadow-lg text-sm font-semibold"
      >
        Change
      </button>

      <input
        ref={(input) => {
          fileInputRefs.current[String(id)] = input;
        }}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const bgImage = getCarouselBackgroundImage();

          if (!bgImage) return;

          onImageChange(event, bgImage.id, componentKey);
          setActiveImageId(null);
        }}
      />
    </div>
  );
}
