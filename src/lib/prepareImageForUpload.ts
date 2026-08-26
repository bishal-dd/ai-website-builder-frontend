import imageCompression from "browser-image-compression";

export async function prepareImageForUpload(file: File) {
  const normalizedFile = new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });

  const compressedFile = await imageCompression(normalizedFile, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: "image/webp",
  });

  const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

  return {
    file: compressedFile,
    fileName,
    fileType: "image/webp",
  };
}
