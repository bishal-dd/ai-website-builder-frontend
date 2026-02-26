"use client";

import {
  Users,
  Globe,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  AlertCircle,
  Clock,
} from "lucide-react";
import useAdminAnalytics from "./hooks/useAdminAnalytics";
import { StatCard } from "./ui/StatCard";
import { CountryTable } from "./ui/CountryTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const AdminAnalytics = () => {
  const { stats, countries, isLoading, error, refetch } = useAdminAnalytics();

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Alert
          variant="destructive"
          className="rounded-xl border-destructive/50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load analytics data."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-sm">
              <BarChart3 className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Analytics
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Real-time platform performance and user demographics.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="bg-white shadow-sm hover:bg-slate-50 h-10 px-4 rounded-lg border-slate-200 transition-all active:scale-95 disabled:opacity-70"
          >
            <RefreshCw
              className={`mr-2 size-4 text-slate-500 transition-transform ${
                isLoading
                  ? "animate-spin"
                  : "group-hover:rotate-180 duration-500"
              }`}
            />
            <span className="text-sm font-semibold">
              {isLoading ? "Syncing..." : "Sync Data"}
            </span>
          </Button>
        </header>

        <Separator className="mb-8" />

        <main className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Key Metrics Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Key Metrics
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-28 w-full rounded-xl bg-slate-200/60"
                  />
                ))
              ) : (
                <>
                  <StatCard
                    title="Total Users"
                    value={stats?.totalUsers ?? 0}
                    icon={Users}
                    colorClass="text-blue-500"
                  />
                  <StatCard
                    title="Total Websites"
                    value={stats?.totalWebsites ?? 0}
                    icon={Globe}
                    colorClass="text-indigo-500"
                  />
                  <StatCard
                    title="Total Pending Websites"
                    value={stats?.totalGenerated ?? 0}
                    icon={Clock}
                    colorClass="text-violet-500"
                  />
                  <StatCard
                    title="Live Deploys"
                    value={stats?.totalDeployed ?? 0}
                    icon={CheckCircle2}
                    colorClass="text-emerald-500"
                  />
                </>
              )}
            </div>
          </section>

          {/* Detailed Data Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Market Reach
              </h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-slate-300/50">
              {isLoading ? (
                <Skeleton className="h-[450px] w-full" />
              ) : (
                <CountryTable countries={countries} />
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;
