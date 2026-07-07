import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getCdnUrl } from "@/lib/cdn";

export interface Template {
  id: string;
  name: string;
  category?: string;
  thumbnail?: string;
}

interface TemplateCardProps {
  template: Template;
  onPreview: () => void;
  onUse?: () => void;
  isLoading?: boolean;
}

export function TemplateCard({
  template,
  onPreview,
  onUse,
  isLoading = false,
}: TemplateCardProps) {
  return (
    <div
      className={`group overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 ${
        isLoading ? "pointer-events-none opacity-70" : ""
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-16/10 overflow-hidden bg-muted">
        <Image
          src={getCdnUrl(template.thumbnail)}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <h3 className="line-clamp-1 font-semibold leading-tight">
          {template.name}
        </h3>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onPreview} disabled={isLoading}>
            {isLoading ? "Loading…" : "View"}
          </Button>

          <Button onClick={onUse} variant="default" disabled={isLoading}>
            {isLoading ? "Please wait…" : "Use template"}
          </Button>
        </div>
      </div>
    </div>
  );
}
