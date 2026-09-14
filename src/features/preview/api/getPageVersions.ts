export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  title: string;
  description: string | null;
  content: unknown;
  createdAt: string;
}

export const getPageVersions = async (
  pageId: string,
): Promise<PageVersion[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/${pageId}/versions`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch page versions");
  }

  return await res.json();
};
