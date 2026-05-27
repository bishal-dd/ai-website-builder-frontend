import {
  Layout,
  Palette,
  Sparkles,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

export interface LoadingStep {
  icon: LucideIcon;
  text: string;
  thoughts: string[];
}

export interface LoadingStateProps {
  isOpen: boolean;
  backendProgress: number;
  title?: string;
  description?: string;
  note?: string;
}

export const loadingSteps: LoadingStep[] = [
  {
    icon: Layout,
    text: "Analyzing structure",
    thoughts: [
      "Mapping component hierarchy...",
      "Defining layout architecture...",
      "Optimizing responsive breakpoints...",
    ],
  },
  {
    icon: Palette,
    text: "Designing interface",
    thoughts: [
      "Selecting color palette...",
      "Crafting visual identity...",
      "Applying design tokens...",
    ],
  },
  {
    icon: Sparkles,
    text: "Adding interactions",
    thoughts: [
      "Implementing smooth transitions...",
      "Fine-tuning animations...",
      "Enhancing user experience...",
    ],
  },
  {
    icon: CheckCircle2,
    text: "Finalizing details",
    thoughts: [
      "Polishing components...",
      "Optimizing performance...",
      "Preparing launch...",
    ],
  },
];
