export const rollbackPageVersion = async (
  pageId: string,
  versionId: string,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/${pageId}/versions/${versionId}/rollback`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(error?.message || "Failed to rollback page version");
  }

  return await res.json();
};
