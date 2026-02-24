"use client";

import { Users, Globe, Layout, CheckCircle2, RefreshCw } from "lucide-react";
import useAdminAnalytics from "./hooks/useAdminAnalytics";
import { StatCard } from "./ui/StatCard";
import { CountryTable } from "./ui/CountryTable";
import { Button } from "@/components/ui/button";

const AdminAnalytics = () => {
  const { stats, countries, isLoading, error, refetch } = useAdminAnalytics();

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Computing metrics...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-red-500">
        Error loading analytics. Please try again.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/30 p-8 space-y-8">
      {/* Header with Manual Refresh */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500">
            Overview of user registrations and website deployments.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="bg-white shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="mr-2 size-4" />
          Refresh Data
        </Button>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Websites"
          value={stats?.totalWebsites ?? 0}
          icon={Globe}
          colorClass="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Generated"
          value={stats?.totalGenerated ?? 0}
          icon={Layout}
          colorClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Live Deploys"
          value={stats?.totalDeployed ?? 0}
          icon={CheckCircle2}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Country Distribution Table */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CountryTable countries={countries} />
        </div>

        {/* Sidebar Mini-Insight */}
        <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
          <h3 className="text-lg font-bold mb-4">Quick Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Success Rate</span>
              <span className="font-mono text-emerald-400">
                {stats?.totalWebsites
                  ? ((stats.totalDeployed / stats.totalWebsites) * 100).toFixed(
                      1,
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Avg Projects/User</span>
              <span className="font-mono text-blue-400">
                {stats?.totalUsers
                  ? (stats.totalWebsites / stats.totalUsers).toFixed(1)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
