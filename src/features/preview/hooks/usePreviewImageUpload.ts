"use client";

import { useState } from "react";

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

      const fileExtension = file.name.split(".").pop() || "png";
      const fileKey = `${crypto.randomUUID()}.${fileExtension}`;

      const presignUrlResponse = await fetch(`${backendUrl}/presign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          fileName: fileKey,
          fileType: file.type,
        }),
      });

      if (!presignUrlResponse.ok) {
        throw new Error("Failed to get image upload URL");
      }

      const { url: presignedUrl } = await presignUrlResponse.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      onUploaded(`${cloudfront}/${userId}/previews/images/${fileKey}`);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploadingImageId(null);
    }
  };

  return {
    uploadingImageId,
    uploadImage,
  };
}
