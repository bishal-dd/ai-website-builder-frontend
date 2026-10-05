export const getCustomizationStatus = async ({
  websiteId,
  jobId,
}: {
  websiteId: string;
  jobId: string;
}) => {
  const params = new URLSearchParams({
    jobId,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/websites/${websiteId}/customization-status?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to check customization status",
    );
  }

  return res.json();
};
