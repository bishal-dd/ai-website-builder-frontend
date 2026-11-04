export interface PreviewImportedWebsiteResponse {
  success: true;
  importId: string;
  title: string;
  previewUrl: string;
}

export async function previewImportedWebsite(
  importId: string,
): Promise<PreviewImportedWebsiteResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!baseUrl) {
    throw new Error("Backend URL is not configured");
  }

  const res = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/api/preview/imported-website/${encodeURIComponent(importId)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      text || `Failed to preview imported website (${res.status})`,
    );
  }

  return res.json() as Promise<PreviewImportedWebsiteResponse>;
}
