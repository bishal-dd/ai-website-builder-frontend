import { create } from "zustand";
import { ComponentKey } from "../ui/renderer/shared/rendererTypes";

interface RendererState {
  hoveredImageId: number | null;
  activeImageId: number | null;
  isEditingText: boolean;
  selectedElementId: number | null;
  selectedComponentKey: ComponentKey | null;

  setHoveredImageId: (id: number | null) => void;
  setActiveImageId: (id: number | null) => void;
  setIsEditingText: (isEditing: boolean) => void;
  setSelectedElementId: (id: number | null) => void;
  setSelectedComponentKey: (componentKey: ComponentKey | null) => void;
}

export const useRendererStore = create<RendererState>((set) => ({
  hoveredImageId: null,
  activeImageId: null,
  isEditingText: false,
  selectedElementId: null,
  selectedComponentKey: null,

  setHoveredImageId: (id) => set({ hoveredImageId: id }),
  setActiveImageId: (id) => set({ activeImageId: id }),
  setIsEditingText: (isEditing) => set({ isEditingText: isEditing }),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  setSelectedComponentKey: (componentKey) =>
    set({ selectedComponentKey: componentKey }),
}));
