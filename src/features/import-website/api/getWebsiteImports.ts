export interface WebsiteImportItem {
  id: string;
  title: string;
  originalFileName: string;
  entryPoint: string;
  status: "uploaded";
  fileCount: number;
  totalSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetWebsiteImportsResponse {
  success: true;
  items: WebsiteImportItem[];
}

export async function getWebsiteImports(): Promise<GetWebsiteImportsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!baseUrl) {
    throw new Error("Backend URL is not configured");
  }

  const res = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/api/websites/imports`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      text || `Failed to fetch imported websites (${res.status})`,
    );
  }

  return res.json() as Promise<GetWebsiteImportsResponse>;
}
