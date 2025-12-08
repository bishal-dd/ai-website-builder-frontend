"use client";

import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "./EmptyState";
import { useRouter } from "next/navigation";
import { useProjects } from "../hooks/useProjects";
import { useState } from "react";

export function DashboardContent() {
  const router = useRouter();
  const { projects, loading } = useProjects(); // fetch real projects
  const [view, setView] = useState<"grid" | "list">("grid");

  const hasProjects = projects.length > 0;

  const images = [
    "/portfolio.png",
    "/hotel.png",
    "/marketing.png",
    "/restaurant.png",
    "/agency.png",
    "/image.png",
  ];

  const projectsWithImages = projects.map((p, idx) => ({
    ...p,
    previewImage: images[idx % images.length],
  }));

  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger className="-ml-2" />
          <div className="flex flex-1 items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
              <p className="text-sm text-muted-foreground">
                {hasProjects
                  ? `${projects.length} website${
                      projects.length > 1 ? "s" : ""
                    } generated`
                  : "No projects yet"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-1 sm:flex">
                <Button
                  variant={view === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setView("list")}
                >
                  <List className="size-4" />
                </Button>
              </div>

              <Button
                size="default"
                className="gap-2 shadow-sm"
                onClick={() => router.push("/wizard")}
              >
                <Plus className="size-4" />
                <span className="hidden sm:inline">New Project</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hasProjects ? (
          <div
            className={`grid gap-6 ${
              view === "grid"
                ? "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {projectsWithImages.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
