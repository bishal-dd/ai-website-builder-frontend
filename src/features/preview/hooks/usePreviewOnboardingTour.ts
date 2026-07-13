"use client";

import { useEffect } from "react";

import {
  startAiHelperOnboardingTour,
  startEditorOnboardingTourInFrame,
} from "@/features/preview/hooks/useEditorOnboardingTour";

interface UsePreviewOnboardingTourParams {
  websiteId: string;
  hasGeneratedWebsite: boolean;
  hasWebsiteElements: boolean;
  hasSeenTour?: boolean;
  disabled?: boolean;
  onFinish: () => void;
}

export function usePreviewOnboardingTour({
  websiteId,
  hasGeneratedWebsite,
  hasWebsiteElements,
  hasSeenTour,
  disabled = false,
  onFinish,
}: UsePreviewOnboardingTourParams) {
  useEffect(() => {
    if (!websiteId) return;
    if (!hasGeneratedWebsite) return;
    if (!hasWebsiteElements) return;
    if (hasSeenTour) return;
    if (disabled) return;

    const timeout = setTimeout(() => {
      const iframe = document.querySelector("iframe");
      const iframeWindow = iframe?.contentWindow;
      const iframeDoc = iframe?.contentDocument;

      if (!iframeWindow || !iframeDoc) return;

      const finishOnboardingTour = () => {
        startAiHelperOnboardingTour(onFinish);
      };

      const hasTourTargets =
        iframeDoc.querySelector('[data-tour="editable-text"]') ||
        iframeDoc.querySelector('[data-tour="site-logo"]');

      if (!hasTourTargets) {
        finishOnboardingTour();
        return;
      }

      startEditorOnboardingTourInFrame(iframeWindow, finishOnboardingTour);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [
    websiteId,
    hasGeneratedWebsite,
    hasWebsiteElements,
    hasSeenTour,
    disabled,
    onFinish,
  ]);
}
