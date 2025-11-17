import { uploadToS3 } from "@/lib/uploadToS3";

export async function handleUpload(file: File, pageId: string) {
  if (!file) throw new Error("No file provided");

  // 1️⃣ Sanitize filename
  const sanitizedName = file.name.replace(/\s+/g, "_");

  // 2️⃣ Upload to S3
  await uploadToS3(sanitizedName, file, file.type);

  // 3️⃣ Build CloudFront URL
  const cloudFrontUrl = `https://d28hne0rpm84ao.cloudfront.net/previews/images/${sanitizedName}`;

  // 4️⃣ Build metadata payload
  const metadata = {
    page_id: pageId,
    mime_type: file.type,
    key: `previews/images/${sanitizedName}`,
    path: cloudFrontUrl,
    caption: sanitizedName,
  };

  // 5️⃣ Save metadata to backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("❌ Backend rejected metadata:", error);
    throw new Error("Metadata save failed");
  }

  // Optional: Return DB record
  const saved = await res.json();

  return {
    cloudFrontUrl,
    metadata: saved,
  };
}
