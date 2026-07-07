import { TemplateCard } from "./TemplateCard";
import { WebsiteTemplate } from "../types/template";

interface TemplateGridProps {
  templates: WebsiteTemplate[];
  onPreview: (templateId: string) => void;
  onUse: (templateId: string) => void;
  loadingTemplateId?: string | null;
}

export function TemplateGrid({
  templates,
  onPreview,
  onUse,
  loadingTemplateId,
}: TemplateGridProps) {
  if (!templates.length) {
    return (
      <div className="text-sm text-muted-foreground">No templates found.</div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onPreview={() => onPreview(template.id)}
          onUse={() => onUse(template.id)}
          isLoading={loadingTemplateId === template.id}
        />
      ))}
    </div>
  );
}
