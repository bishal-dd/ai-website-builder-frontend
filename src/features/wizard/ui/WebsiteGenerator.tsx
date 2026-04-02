"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "../loading/ui/LoadingState";
import { useWizardStore } from "../store/wizardStore";
import posthog from "posthog-js";
import ShareCongratsModal from "./ShareCongratsModal";

export function WebsiteGenerator({ jobId }: { jobId: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const hasCompletedRef = useRef(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [generatedWebsiteId, setGeneratedWebsiteId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const setWebsiteId = useWizardStore((state) => state.setWebsiteId);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job/${jobId}/status`,
        );
        const data = await res.json();

        setProgress(data.progress || 0);

        if (data.status === "completed" && !hasCompletedRef.current) {
          hasCompletedRef.current = true;

          setWebsiteId(data.websiteId);

          posthog.capture("website_generation_completed", {
            job_id: jobId,
            website_id: data.websiteId,
          });

          setIsOpen(false);
          clearInterval(interval);

          if (audioRef.current) {
            audioRef.current.play().catch((err) => console.error(err));
          }

          setGeneratedWebsiteId(data.websiteId);
          setShowCongratsModal(true);
        } else if (data.status === "failed") {
          // Capture website generation failed event
          posthog.capture("website_generation_failed", {
            job_id: jobId,
            error: data.error || "Unknown error",
          });

          clearInterval(interval);
          setIsOpen(false);
          alert("Website generation failed. Try again.");
        }
      } catch (err) {
        console.error("Error fetching job status:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, router, setWebsiteId]);

  return (
    <>
      <LoadingState isOpen={isOpen} backendProgress={progress} />

      {generatedWebsiteId && (
        <ShareCongratsModal
          open={showCongratsModal}
          websiteId={generatedWebsiteId}
          onContinue={() => {
            setShowCongratsModal(false);
            router.push(`/preview/${generatedWebsiteId}`);
          }}
        />
      )}

      <audio ref={audioRef} src="/sounds/success.wav" />
    </>
  );
}
