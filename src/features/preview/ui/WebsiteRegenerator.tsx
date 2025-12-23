"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/features/wizard/loading/ui/LoadingState";

export function WebsiteRegenerator({
  jobId,
  websiteId,
  onComplete,
}: {
  jobId: string;
  websiteId: string;
  onComplete?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!jobId) return;

    let lastProgress = 0;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job/regenerate/${jobId}/status`
        );
        const data = await res.json();

        const newProgress = Math.max(lastProgress, data.progress || 0);
        lastProgress = newProgress;

        // Animate progress smoothly
        setProgress((prev) => prev + (newProgress - prev) * 0.3); // smooth lerp

        if (newProgress >= 100 || data.status === "completed") {
          setProgress(100);
          setIsOpen(false);
          clearInterval(interval);

          audioRef.current?.play().catch(console.error);

          if (onComplete) onComplete();
          else router.push(`/preview/${websiteId}`);
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
  }, [jobId, router, websiteId, onComplete]);

  return (
    <>
      <LoadingState isOpen={isOpen} backendProgress={progress} />
      <audio ref={audioRef} src="/sounds/success.wav" />
    </>
  );
}
