"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiFacebook } from "@icons-pack/react-simple-icons";
import { generatePreviewWebsite } from "@/features/preview/api/generatePreviewWebsite";
type Props = {
  open: boolean;
  websiteId: string;
  onContinue: () => void;
  onClose: () => void;
};

type PreviewResponse = {
  success: boolean;
  previewUrl: string;
  version: number;
};

export default function ShareCongratsModal({
  open,
  websiteId,
  onClose,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);

  useEffect(() => {
    if (!open || !websiteId) return;

    let isMounted = true;

    const fetchPreviewUrl = async () => {
      try {
        setIsLoading(true);

        const data = await generatePreviewWebsite(websiteId);

        if (!isMounted) return;

        setPreviewData(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to prepare share link");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPreviewUrl();

    return () => {
      isMounted = false;
    };
  }, [open, websiteId]);

  const finalPreviewUrl = useMemo(() => {
    if (!previewData) return "";

    return `${previewData.previewUrl}?v=${previewData.version}`;
  }, [previewData]);

  // Facebook timeline share
  const handleFacebookShare = () => {
    if (!finalPreviewUrl) return;

    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      finalPreviewUrl,
    )}`;

    window.open(
      fbShareUrl,
      "_blank",
      "width=600,height=400,noopener,noreferrer",
    );

    toast.success("Thanks for sharing on Facebook!");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      {" "}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">🎉 Congratulations!</DialogTitle>

          <DialogDescription className="pt-2 text-base">
            Great work! Your website has been successfully generated.
            <br />
            Share your creation with friends or on Instagram and Facebook to
            show off your hard work!
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">
                Preparing your share link...
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={handleFacebookShare}
                disabled={!finalPreviewUrl}
              >
                <SiFacebook size={18} />
                <span className="font-semibold">Share on Facebook</span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
