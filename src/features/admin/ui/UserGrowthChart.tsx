"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format, parseISO, isValid, eachDayOfInterval, parse } from "date-fns";

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
import useUserGrowth from "../hooks/useUserGrowth";
import { TrendingUp } from "lucide-react";

const chartConfig = {
  count: {
    label: "Registrations",
    color: "#FDCA1C",
  },
} satisfies ChartConfig;

export function UserGrowthChart() {
  const { data: realData, isLoading, error } = useUserGrowth();

  const processedData = React.useMemo(() => {
    if (!realData?.length) return [];

    const parseDateString = (dateStr: string) =>
      parse(dateStr, "yyyy-MM-dd HH:mm:ss", new Date());

    const dataMap = new Map<string, number>();

    realData.forEach((d) => {
      const parsed = parseDateString(d.date);
      if (isValid(parsed)) {
        dataMap.set(format(parsed, "yyyy-MM-dd"), d.count);
      }
    });

    const dates = Array.from(dataMap.keys()).map((date) => parseISO(date));

    if (!dates.length) return [];

    const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const endDate = new Date();

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return allDays.map((day) => {
      const key = format(day, "yyyy-MM-dd");

      return {
        date: key,
        count: dataMap.get(key) || 0,
      };
    });
  }, [realData]);

  const totalRegistrations = React.useMemo(
    () => processedData.reduce((acc, curr) => acc + curr.count, 0),
    [processedData],
  );

  if (isLoading) return <Skeleton className="h-[450px] w-full rounded-xl" />;

  if (error)
    return (
      <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
        Failed to load growth data.
      </div>
    );

  if (!processedData.length)
    return (
      <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
        No growth data found.
      </div>
    );

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FDCA1C]" />
            <CardTitle className="text-xl font-bold">User Growth</CardTitle>
          </div>

          <CardDescription>Daily user registrations over time.</CardDescription>
        </div>
        <div className="flex">
          <div className="flex flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6 bg-[#FFFAEE]/50 min-w-[160px]">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Total Users
            </span>
            <span className="text-2xl leading-none font-bold sm:text-3xl text-black">
              {totalRegistrations.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={processedData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={60}
              tickFormatter={(value) => format(parseISO(value), "MMM d")}
            />
            <YAxis hide domain={[0, "auto"]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px] rounded-xl border-slate-200 shadow-2xl"
                  nameKey="count"
                  labelFormatter={(value) =>
                    format(parseISO(value), "EEEE, MMM dd, yyyy")
                  }
                />
              }
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke={chartConfig.count.color}
              strokeWidth={1.5}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.count > 0 && processedData.length < 100) {
                  return <circle cx={cx} cy={cy} r={3} fill="#FDCA1C" />;
                }
                return null;
              }}
              activeDot={{
                r: 6,
                fill: "#FDCA1C",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
