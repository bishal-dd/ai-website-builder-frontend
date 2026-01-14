import { ExternalLink, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  domain: string | null;
  createdAt: string;
  previewImage?: string;
  description?: string;
}

export function ProjectCard({ project }: { project: Project }) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const previewUrl =
    project.previewImage ||
    `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
      `Modern ${project.name} website preview`,
    )}`;

  return (
    <Card className="group relative aspect-[4/3] overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-primary/5">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={previewUrl}
          alt={`${project.name} preview`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

      <div className="relative flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-2 mb-auto"></div>

        <div className="flex flex-col gap-3">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold leading-tight tracking-tight text-balance text-white drop-shadow-lg">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-white/90 line-clamp-2 drop-shadow">
                {project.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
              {project.domain && (
                <div className="flex items-center gap-1.5">
                  <ExternalLink className="size-3.5" />
                  <span className="truncate font-mono">{project.domain}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {/* Updated Button with Silver Color */}
            <Button
              size="sm"
              variant="default"
              className="gap-1 px-3 py-1 text-xs bg-primary text-primary-foreground border border-primary/80 hover:bg-primary/90 hover:scale-105 transition-all duration-200"
              asChild
            >
              <Link
                href={`/preview/${project.id}`}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
