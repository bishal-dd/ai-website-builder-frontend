"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProjectCard } from "./ui/ProjectCard";
import { EmptyState } from "./ui/EmptyState";
import { useProjects } from "./hooks/useProjects";
import { useState } from "react";
import Link from "next/link";

export function DashboardContent() {
  const { projects, isLoading, error } = useProjects();
  const [view] = useState<"grid" | "list">("grid");

  const hasProjects = projects.length > 0;

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
              <Button size="default" className="gap-2 shadow-sm" asChild>
                <Link href="/wizard">
                  <Plus className="size-4" />
                  <span className="hidden sm:inline">New Project</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center mt-20 text-red-500">
            Error loading projects: {error.message}
          </div>
        ) : hasProjects ? (
          <div
            className={`grid gap-6 ${
              view === "grid"
                ? "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {projects.map((project) => (
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
