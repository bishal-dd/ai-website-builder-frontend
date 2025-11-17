// src/lib/s3-upload.ts
export async function uploadToS3(
  fileName: string,
  fileContent: string | Blob,
  fileType: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, fileType }),
  });

  if (!res.ok) throw new Error("Failed to get presigned URL");

  const { url } = await res.json();

  // 2️⃣ Upload the file directly to S3
  const uploadRes = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": fileType },
    body: fileContent,
  });

  if (!uploadRes.ok) throw new Error("Upload failed");

  // 3️⃣ Return public URL (remove query string)
  return url.split("?")[0];
}
