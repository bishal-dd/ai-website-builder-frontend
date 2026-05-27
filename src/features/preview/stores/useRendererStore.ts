import { create } from "zustand";

interface RendererState {
  hoveredImageId: number | null;
  activeImageId: number | null;
  isEditingText: boolean;

  setHoveredImageId: (id: number | null) => void;
  setActiveImageId: (id: number | null) => void;
  setIsEditingText: (isEditing: boolean) => void;
}

export const useRendererStore = create<RendererState>((set) => ({
  hoveredImageId: null,
  activeImageId: null,
  isEditingText: false,

  setHoveredImageId: (id) => set({ hoveredImageId: id }),
  setActiveImageId: (id) => set({ activeImageId: id }),
  setIsEditingText: (isEditing) => set({ isEditingText: isEditing }),
}));
