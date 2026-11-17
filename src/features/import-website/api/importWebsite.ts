export interface ImportWebsiteResponse {
  importId: string;
  status: "validated";
  entryPoint: string;
  fileCount: number;
  totalSize: number;
  storageKey: string;
}

export async function importWebsite(
  file: File,
): Promise<ImportWebsiteResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/websites/import`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to import website: ${text}`);
  }

  return res.json();
}
