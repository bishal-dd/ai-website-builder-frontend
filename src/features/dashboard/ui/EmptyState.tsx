import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      {/* Heading */}
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
        No Projects Yet
      </h2>

      {/* Subtext */}
      <p className="mb-8 max-w-lg text-lg text-gray-600 leading-relaxed">
        Bring your ideas to life and build stunning websites instantly. Start
        your first project now and see your vision in action!
      </p>

      {/* Primary CTA */}
      <Button
        size="lg"
        className="shadow-lg shadow-primary/25 px-6 py-3"
        asChild
      >
        <Link href="/wizard">Create Your First Project</Link>
      </Button>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-gray-700">
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold">AI-Powered</span>
          <p className="text-center text-sm text-gray-500">
            Generate website content and layouts effortlessly.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold">Lightning Fast</span>
          <p className="text-center text-sm text-gray-500">
            Build and preview your projects instantly without delays.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold">Production Ready</span>
          <p className="text-center text-sm text-gray-500">
            Deploy polished projects that are ready for real-world use.
          </p>
        </div>
      </div>
    </div>
  );
}
