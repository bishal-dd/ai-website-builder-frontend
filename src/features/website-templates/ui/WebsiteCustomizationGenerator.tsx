"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import posthog from "posthog-js";
import { LoadingState } from "@/features/wizard/loading/ui/LoadingState";

interface Props {
  websiteId: string;
  jobId: string;
  onComplete: () => void;
}

export function WebsiteCustomizationGenerator({
  websiteId,
  jobId,
  onComplete,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(0);

  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/websites/${websiteId}/customization-status?jobId=${jobId}`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        console.log("[CUSTOMIZATION STATUS]", data);

        setProgress(data.progress || 0);

        if (data.status === "completed") {
          posthog.capture("website_customization_completed", {
            job_id: jobId,
            website_id: websiteId,
          });

          setProgress(100);
          clearInterval(interval);

          if (audioRef.current) {
            audioRef.current.play().catch((err) => {
              console.error(err);
            });
          }

          await queryClient.refetchQueries({
            queryKey: ["website", websiteId],
          });

          onComplete();
          setIsOpen(false);
        } else if (data.status === "failed") {
          posthog.capture("website_customization_failed", {
            job_id: jobId,
            website_id: websiteId,
            error: data.error || "Unknown error",
          });

          clearInterval(interval);
          setIsOpen(false);

          console.error("[CUSTOMIZATION] Failed:", data.error);
        }
      } catch (err) {
        console.error("[CUSTOMIZATION] Error fetching job status:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, websiteId, queryClient, onComplete]);

  return (
    <>
      <LoadingState
        isOpen={isOpen}
        backendProgress={progress}
        title="Customizing Your Website"
        description="We're personalizing your website based on the information you provided."
        note="This may take a moment."
      />

      <audio ref={audioRef} src="/sounds/success.wav" />
    </>
  );
}
