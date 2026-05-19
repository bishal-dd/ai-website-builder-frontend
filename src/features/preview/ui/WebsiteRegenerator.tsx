"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/features/wizard/loading/ui/LoadingState";

export function WebsiteRegenerator({
  jobId,
  websiteId,
}: {
  jobId: string;
  websiteId: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!jobId) return;

    let lastProgress = 0;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job/regenerate/${jobId}/status`,
        );
        const data = await res.json();

        const newProgress = Math.max(lastProgress, data.progress || 0);
        lastProgress = newProgress;

        // Animate progress smoothly
        setProgress((prev) => prev + (newProgress - prev) * 0.3); // smooth lerp

        if (newProgress >= 100 || data.status === "completed") {
          completedRef.current = true;
          setProgress(100);
          setIsOpen(false);
          clearInterval(interval);

          audioRef.current?.play().catch(console.error);
          window.location.reload();
        } else if (data.status === "failed") {
          setIsOpen(false);
          clearInterval(interval);
          alert("Website regeneration failed.");
        }
      } catch (err) {
        console.error("Error fetching job status:", err);
      }
    }, 500); // poll every 0.5s for smoother progress

    return () => clearInterval(interval);
  }, [jobId, router, websiteId]);

  return (
    <>
      <LoadingState
        isOpen={isOpen}
        backendProgress={progress}
        title="Regenerating Your Website"
        description="Applying your requested changes to the selected page."
        note="Your preview will refresh automatically when the update is ready."
      />
      <audio ref={audioRef} src="/sounds/success.wav" />
    </>
  );
}
