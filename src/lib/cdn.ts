export const CDN_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

export function getCdnUrl(path?: string | null) {
  if (!path) return "/placeholder.svg";
  return `${CDN_URL}/${path}`;
}
