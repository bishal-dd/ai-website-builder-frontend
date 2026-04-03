"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "../loading/ui/LoadingState";
import { useWizardStore } from "../store/wizardStore";
import posthog from "posthog-js";

export function WebsiteGenerator({ jobId }: { jobId: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(0);
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

        if (data.status === "completed") {
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

          setTimeout(() => {
            router.push(`/preview/${data.websiteId}?firstLoad=true`);
          }, 1000);
        } else if (data.status === "failed") {
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
      <audio ref={audioRef} src="/sounds/success.wav" />
    </>
  );
}
