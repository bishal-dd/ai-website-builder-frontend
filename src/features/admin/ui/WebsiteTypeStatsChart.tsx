"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import useWebsiteTypeStats from "../hooks/useWebsiteTypeStats";

const chartConfig = {
  count: {
    label: "Websites",
    color: "#FDCA1C",
  },
} satisfies ChartConfig;

const formatTypeLabel = (type: string | null) => {
  if (!type) return "Unknown";
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export function WebsiteTypeStatsChart() {
  const { websiteTypes, isLoading } = useWebsiteTypeStats();

  const totalWebsites = React.useMemo(
    () => websiteTypes.reduce((acc, item) => acc + Number(item.count), 0),
    [websiteTypes],
  );

  const chartData = React.useMemo(() => {
    return (
      websiteTypes
        .map((item) => ({
          ...item,
          label: formatTypeLabel(item.type),
          count: Number(item.count),
        }))
        // Sort by count descending to make comparison instant
        .sort((a, b) => b.count - a.count)
    );
  }, [websiteTypes]);

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-[#FDCA1C]" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                Website Categories
              </CardTitle>
              <CardDescription>
                Volume breakdown by industry/type
              </CardDescription>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6 bg-slate-50/50 min-w-40">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Total Websites
            </span>
            <span className="text-2xl leading-none font-bold sm:text-3xl text-black">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                totalWebsites.toLocaleString()
              )}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ChartContainer
          config={chartConfig}
          className={`w-full ${isLoading ? "h-75" : ""}`}
          style={{
            height: `${chartData.length * 50 + 50}px`,
            minHeight: "300px",
          }}
        >
          {isLoading ? (
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
              barGap={8}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="label"
                type="category"
                tickLine={false}
                axisLine={false}
                width={120}
                className="text-xs font-medium text-slate-600"
              />
              <ChartTooltip
                cursor={{ fill: "#f8fafc" }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="#FDCA1C"
                radius={[0, 4, 4, 0]}
                barSize={28}
                background={{ fill: "#f1f5f9", radius: 4 }}
                label={{
                  position: "right", // shows number to the right of the bar
                  fill: "#000", // text color
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#EAB308" : "#FDCA1C"}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
