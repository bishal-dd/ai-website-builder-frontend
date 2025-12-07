import { useEffect, useState } from "react";

type Status =
  | "awaiting_payment"
  | "pending_approval"
  | "deploying"
  | "completed"
  | "failed";

export function useWebsiteDeploymentStatus(websiteId?: string) {
  const [status, setStatus] = useState<Status>("awaiting_payment");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!websiteId || (status !== "pending_approval" && status !== "deploying"))
      return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/website/deployment-status/${websiteId}`
        );
        const data = await res.json();

        if (!data.isPaid) {
          setStatus("pending_approval");
        } else if (data.deployment_status === "queued") {
          setStatus("deploying");
          setProgress(50); // optional: simulate progress
        } else if (data.deployment_status === "completed") {
          setStatus("completed");
          setProgress(100);
          clearInterval(interval);
        } else if (data.deployment_status === "failed") {
          setStatus("failed");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching website status:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [websiteId, status]);

  return { status, setStatus, progress };
}
