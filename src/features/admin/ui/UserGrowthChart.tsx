"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import useUserGrowth from "../hooks/useUserGrowth";
import {
  Activity,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO, isValid } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export function UserGrowthChart() {
  const { data, isLoading, error, refetch } = useUserGrowth();

  if (isLoading) return <Skeleton className="h-[500px] w-full rounded-xl" />;

  if (error || !data?.length)
    return (
      <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
        No daily data found.
      </div>
    );

  const dailyData = data;
  const maxValue = Math.max(...dailyData.map((d) => d.count));
  const minValue = Math.min(...dailyData.map((d) => d.count));
  const totalRegistrations = dailyData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-sm">
              <Activity className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                User Growth
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Daily acquisition velocity and registration trends.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => refetch()}
            className="bg-white shadow-sm hover:bg-slate-50 h-10 px-4 rounded-lg border-slate-200 transition-all active:scale-95"
          >
            <RefreshCw
              className={`mr-2 size-4 text-slate-500 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="text-sm font-semibold">Sync Data</span>
          </Button>
        </header>

        <Separator className="mb-8" />

        <main className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Growth Highlights
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Peak Daily
                  </p>
                  <TrendingUp className="size-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold">
                  {maxValue.toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Lowest Daily
                  </p>
                  <TrendingDown className="size-4 text-rose-500" />
                </div>
                <p className="text-2xl font-bold">
                  {minValue.toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Period
                  </p>
                  <Zap className="size-4 text-amber-500" />
                </div>
                <p className="text-2xl font-bold">
                  {totalRegistrations.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Visual Trend
            </h2>
            <Card className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="chartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="4 4"
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                      minTickGap={40}
                      interval="preserveStartEnd"
                      tickFormatter={(val) => {
                        const d = parseISO(val);
                        return isValid(d) ? format(d, "MMM dd") : "";
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />

                    {/* --- THE FIX IS HERE --- */}
                    <Tooltip
                      labelFormatter={(label) => {
                        const d = parseISO(label);
                        return isValid(d) ? format(d, "MMM dd, yyyy") : label;
                      }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    {/* ----------------------- */}

                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#chartGradient)"
                      dot={false} // Keeps UI clean as user base grows
                      activeDot={{
                        r: 4,
                        strokeWidth: 2,
                        fill: "#fff",
                        stroke: "#3b82f6",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
