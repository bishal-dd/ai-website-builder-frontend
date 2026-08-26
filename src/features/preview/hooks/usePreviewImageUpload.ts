"use client";

import { prepareImageForUpload } from "@/lib/prepareImageForUpload";
import {
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
} from "@/shared/constants/upload";
import { useState } from "react";
import { toast } from "sonner";

interface UsePreviewImageUploadParams {
  userId?: string;
}

interface UploadImageParams {
  file: File;
  elementId: number;
  onUploaded: (content: string) => void;
}

export function usePreviewImageUpload({ userId }: UsePreviewImageUploadParams) {
  const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);

  const uploadImage = async ({
    file,
    elementId,
    onUploaded,
  }: UploadImageParams) => {
    try {
      setUploadingImageId(elementId);

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error(`Image must be smaller than ${MAX_IMAGE_SIZE_MB} MB`);
      }

      const preparedImage = await prepareImageForUpload(file);

      if (preparedImage.file.size > 300 * 1024) {
        throw new Error("Unable to compress image below 300 KB");
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
      }

      const cloudfront = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

      if (!cloudfront) {
        throw new Error("NEXT_PUBLIC_CLOUDFRONT_URL is not defined");
      }

      if (!userId) {
        throw new Error("User id is required to upload preview image");
      }

      const fileKey = `${crypto.randomUUID()}.webp`;

      const presignUrlResponse = await fetch(`${backendUrl}/presign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          fileName: fileKey,
          fileType: preparedImage.fileType,
        }),
      });

      if (!presignUrlResponse.ok) {
        throw new Error("Failed to get image upload URL");
      }

      const { url: presignedUrl } = await presignUrlResponse.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": preparedImage.fileType,
        },
        body: preparedImage.file,
      });

      onUploaded(`${cloudfront}/${userId}/previews/images/${fileKey}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setUploadingImageId(null);
    }
  };

  return {
    uploadingImageId,
    uploadImage,
  };
}
