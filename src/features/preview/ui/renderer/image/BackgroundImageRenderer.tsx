import { useRendererStore } from "@/features/preview/stores/useRendererStore";

import type {
  ComponentKey,
  DeviceType,
  FileInputRefs,
  ImageChangeHandler,
} from "../shared/rendererTypes";

interface BackgroundImageRendererProps {
  id: number;
  imageSrc?: string;
  device: DeviceType;
  componentKey?: ComponentKey;
  fileInputRefs: FileInputRefs;
  uploadingImageId: number | null;
  onImageChange: ImageChangeHandler;
}

export function BackgroundImageRenderer({
  id,
  imageSrc,
  device,
  componentKey,
  fileInputRefs,
  uploadingImageId,
  onImageChange,
}: BackgroundImageRendererProps) {
  const setHoveredImageId = useRendererStore(
    (state) => state.setHoveredImageId,
  );

  return (
    <div
      key={id}
      className="absolute inset-0"
      onMouseEnter={() => device === "desktop" && setHoveredImageId(id)}
      onMouseLeave={() => device === "desktop" && setHoveredImageId(null)}
    >
      <img
        src={imageSrc}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        alt=""
      />

      <button
        onClick={(event) => {
          event.stopPropagation();

          if (!uploadingImageId) {
            fileInputRefs.current[String(id)]?.click();
          }
        }}
        className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
      >
        {uploadingImageId === id ? "Uploading..." : "Change"}
      </button>

      <input
        ref={(input) => {
          fileInputRefs.current[String(id)] = input;
        }}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploadingImageId === id}
        onChange={(event) => onImageChange(event, id, componentKey)}
      />
    </div>
  );
}
