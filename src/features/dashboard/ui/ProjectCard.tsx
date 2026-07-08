"use client";
import { Clock, Globe, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useUpdateWebsite from "@/features/preview/hooks/useUpdateWebsite";
import { WebsiteDetailsDialog } from "./WebsiteDetailsDialog";
import { useRouter } from "next/navigation";
import useDeleteWebsite from "../hooks/useDeleteWebsite";
import { toast } from "sonner";
import { DeleteWebsiteDialog } from "./DeleteWebsiteDialog";

interface Project {
  id: string;
  name: string;
  domain: string | null;
  createdAt: string;
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

  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateWebsite = useUpdateWebsite();
  const deleteWebsite = useDeleteWebsite();

  const handleDelete = () => {
    toast.promise(deleteWebsite.mutateAsync(project.id), {
      loading: "Deleting website...",
      success: "Website deleted successfully",
      error: "Failed to delete website",
    });
  };

  const handleUpdate = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    updateWebsite.mutate({
      websiteId: project.id,
      body: { title, description },
    });
  };

  const getGradientClass = (name: string) => {
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      "from-blue-500/20 via-cyan-500/10 to-transparent",
      "from-emerald-500/20 via-teal-500/10 to-transparent",
      "from-orange-500/20 via-amber-500/10 to-transparent",
      "from-rose-500/20 via-pink-500/10 to-transparent",
      "from-indigo-500/20 via-blue-500/10 to-transparent",
    ];
    return gradients[hash % gradients.length];
  };

  return (
    <div className="block">
      <Card
        className="group relative cursor-pointer overflow-hidden border-border/50 bg-card transition-all duration-500 hover:border-border hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
        onClick={() => router.push(`/preview/${project.id}`)}
      >
        {/* Animated gradient background */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${getGradientClass(
            project.name,
          )} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_1px)] bg-size-[24px_24px]" />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* FLOATING ACTIONS: Appears smoothly on card hover */}
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()} // Stop card click anywhere in this container
        >
          <Button
            variant="secondary"
            size="icon"
            className="size-8 rounded-lg bg-background/80 backdrop-blur-md shadow-xs hover:bg-background border"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-3.5 text-muted-foreground hover:text-foreground transition-colors" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="size-8 rounded-lg bg-background/80 backdrop-blur-md shadow-xs hover:bg-destructive hover:text-destructive-foreground border text-muted-foreground transition-colors"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <div className="relative flex flex-col p-5">
          {/* Header with icon and domain */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
              <Globe className="size-5" />
            </div>
            {project.domain && (
              <Badge
                variant="secondary"
                className="font-mono text-[10px] tracking-wide bg-secondary/80 backdrop-blur-sm max-w-37.5 truncate"
              >
                {project.domain}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2 mb-4">
            <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-foreground/90 transition-colors line-clamp-1 pr-16">
              {project.name}
            </h3>
            {project.description ? (
              <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No description
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <span>Open</span>
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute -bottom-12 -right-12 size-24 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>

      <WebsiteDetailsDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialName={project.name}
        initialDescription={project.description ?? ""}
        onSave={handleUpdate}
      />
      <DeleteWebsiteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        websiteName={project.name}
        onConfirm={handleDelete}
      />
    </div>
  );
}
