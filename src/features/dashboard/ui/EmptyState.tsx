import { Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex size-24 items-center justify-center rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg">
          <Sparkles className="size-12 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="mb-3 text-3xl font-semibold tracking-tight">
        No projects yet
      </h2>
      <p className="mb-8 max-w-md text-lg text-muted-foreground text-pretty leading-relaxed">
        {
          "Transform your ideas into beautiful websites instantly with AI. Start creating your first project now!"
        }
      </p>

      <Button size="lg" className="gap-2 shadow-lg shadow-primary/25" asChild>
        <Link href="/wizard">
          <Zap className="size-5" />
          Create Your First Project
        </Link>
      </Button>

      <div className="mt-12 grid grid-cols-3 gap-8 text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Zap className="size-5" />
          </div>
          <span className="font-medium">AI-Powered</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="font-medium">Lightning Fast</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="font-medium">Production Ready</span>
        </div>
      </div>
    </div>
  );
}
