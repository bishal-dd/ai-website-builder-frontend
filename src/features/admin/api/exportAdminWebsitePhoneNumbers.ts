export async function exportAdminWebsitePhoneNumbers({
  type,
  status = "",
}: {
  type: string;
  status?: string;
}): Promise<Blob> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/websites-by-type/export`,
  );

  url.searchParams.append("type", type.trim());

  if (status.trim()) {
    url.searchParams.append("status", status.trim());
  }

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to export website phone numbers");
  }

  return res.blob();
}
