"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Share2, Facebook, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { generatePreviewWebsite } from "@/features/preview/api/generatePreviewWebsite";
type Props = {
  open: boolean;
  websiteId: string;
  onContinue: () => void;
};

type PreviewResponse = {
  success: boolean;
  previewUrl: string;
  version: number;
};

export default function ShareCongratsModal({
  open,
  websiteId,
  onContinue,
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

  const handleWhatsappShare = () => {
    if (!finalPreviewUrl) return;

    const url = `https://wa.me/?text=${encodeURIComponent(
      `🎉 Check out the website I just created! ${finalPreviewUrl}`,
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");

    toast.success("Discount unlocked for WhatsApp sharing 🎁");
  };

  const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;

  const handleMessengerShare = () => {
    if (!finalPreviewUrl) return;

    const redirectUri = encodeURIComponent(window.location.origin);
    const link = encodeURIComponent(finalPreviewUrl);

    const url = `https://www.facebook.com/dialog/send?app_id=${FB_APP_ID}&link=${link}&redirect_uri=${redirectUri}`;

    window.open(url, "_blank", "width=600,height=400,noopener,noreferrer");

    toast.success("Discount unlocked for sharing with friends! 🎁");
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">🎉 Congratulations!</DialogTitle>

          <DialogDescription className="pt-2 text-base">
            Your website has been successfully generated.
            <br />
            Share it on WhatsApp or Facebook and get a discount on deployment.
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
                onClick={handleWhatsappShare}
                disabled={!finalPreviewUrl}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Share on WhatsApp
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleMessengerShare}
                disabled={!finalPreviewUrl}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Share on Facebook
              </Button>

              <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                🎁 Share now and receive a deployment discount automatically.
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onContinue} disabled={isLoading}>
            <Share2 className="mr-2 h-4 w-4" />
            Continue to Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
