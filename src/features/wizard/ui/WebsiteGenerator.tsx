"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "../loading/ui/LoadingState";

export function WebsiteGenerator({ jobId }: { jobId: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState("processing");
  const [progress, setProgress] = useState(0);
  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job/${jobId}/status`
        );
        const data = await res.json();

        setStatus(data.status);
        setProgress(data.progress || 0);

        if (data.status === "completed") {
          setWebsiteId(data.websiteId);
          setIsOpen(false);
          clearInterval(interval);

          // Play success audio
          if (audioRef.current) {
            audioRef.current.play().catch((err) => console.error(err));
          }

          // Optional: redirect after short delay
          setTimeout(() => router.push(`/preview/${data.websiteId}`), 500);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setIsOpen(false);
          alert("Website generation failed. Try again.");
        }
      } catch (err) {
        console.error("Error fetching job status:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, router]);

  return (
    <>
      <LoadingState isOpen={isOpen} backendProgress={progress} />
      <audio ref={audioRef} src="/sounds/success.wav" />
    </>
  );
}
