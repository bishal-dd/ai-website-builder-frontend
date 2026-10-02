export async function exportAdminUserEmails({
  search = "",
  status = "",
  date,
  startDate,
  endDate,
}: {
  search?: string;
  status?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<Blob> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users-websites/export`,
  );

  if (search.trim()) {
    url.searchParams.append("search", search.trim());
  }

  if (status.trim()) {
    url.searchParams.append("status", status.trim());
  }

  if (date?.trim()) {
    url.searchParams.append("date", date.trim());
  } else {
    if (startDate?.trim()) {
      url.searchParams.append("startDate", startDate.trim());
    }

    if (endDate?.trim()) {
      url.searchParams.append("endDate", endDate.trim());
    }
  }

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to export user emails");
  }

  return res.blob();
}
