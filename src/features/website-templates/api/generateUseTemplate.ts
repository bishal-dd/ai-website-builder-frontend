export const generateUseTemplate = async ({
  templateId,
  title,
}: {
  templateId: string;
  title?: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/templates/use`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        templateId,
        title,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to use template");
  }

  return res.json();
};
