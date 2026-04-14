"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  format,
  parseISO,
  isValid,
  eachDayOfInterval,
  startOfMonth,
  subMonths,
  endOfMonth,
} from "date-fns";
import { TrendingUp, Calendar as CalendarIcon, X, Check } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import useUserGrowth from "../hooks/useUserGrowth";
import { Calendar } from "@/components/ui/calendar";

const chartConfig = {
  count: {
    label: "Registrations",
    color: "#FDCA1C",
  },
} satisfies ChartConfig;

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: {
    date: string;
    count: number;
  };
}

export function UserGrowthChart() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- URL State Management ---
  const timeRange = searchParams.get("range") || "this-month";
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  // Local UI states (Not stored in URL)
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(() => {
    if (fromParam && toParam) {
      return { from: parseISO(fromParam), to: parseISO(toParam) };
    }
    return undefined;
  });

  // Helper to sync state to URL
  const updateUrl = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const range = React.useMemo(() => {
    const now = new Date();
    if (timeRange === "custom" && fromParam && toParam) {
      return { start: fromParam, end: toParam };
    }
    if (timeRange === "this-month") {
      return {
        start: format(startOfMonth(now), "yyyy-MM-dd"),
        end: format(now, "yyyy-MM-dd"),
      };
    }
    if (timeRange === "last-month") {
      const last = subMonths(now, 1);
      return {
        start: format(startOfMonth(last), "yyyy-MM-dd"),
        end: format(endOfMonth(last), "yyyy-MM-dd"),
      };
    }
    return { start: undefined, end: undefined };
  }, [timeRange, fromParam, toParam]);

  const { data: realData, isLoading } = useUserGrowth(range.start, range.end);

  const processedData = React.useMemo(() => {
    if (!realData) return [];
    const dataMap = new Map<string, number>();
    realData.forEach((d) => {
      const parsed = parseISO(d.date);
      if (isValid(parsed)) dataMap.set(format(parsed, "yyyy-MM-dd"), d.count);
    });

    let startDate: Date;
    let endDate: Date = new Date();

    if (range.start && range.end) {
      startDate = parseISO(range.start);
      endDate = parseISO(range.end);
    } else if (realData.length > 0) {
      startDate = parseISO(realData[0].date);
    } else {
      startDate = subMonths(new Date(), 1);
    }

    if (!isValid(startDate) || !isValid(endDate) || startDate > endDate)
      return [];
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return allDays.map((day) => {
      const key = format(day, "yyyy-MM-dd");
      return { date: key, count: dataMap.get(key) || 0 };
    });
  }, [realData, range]);

  const totalRegistrations = React.useMemo(
    () => processedData.reduce((acc, curr) => acc + curr.count, 0),
    [processedData],
  );

  // --- Handlers ---
  const handleApply = () => {
    if (tempDate?.from && tempDate?.to) {
      updateUrl({
        range: "custom",
        from: format(tempDate.from, "yyyy-MM-dd"),
        to: format(tempDate.to, "yyyy-MM-dd"),
      });
      setCalendarOpen(false);
    }
  };

  const handleClear = () => {
    setTempDate(undefined);
  };

  const handleRangeChange = (value: string) => {
    updateUrl({ range: value, from: null, to: null });
    setTempDate(undefined);
    setCalendarOpen(false);
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FDCA1C]" />
              <CardTitle className="text-xl font-bold">User Growth</CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={timeRange === "custom" ? "" : timeRange}
                onValueChange={handleRangeChange}
              >
                <SelectTrigger className="w-40 h-8 text-xs border-none bg-slate-50">
                  <SelectValue placeholder="Custom range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>

              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-8 w-8 border-none bg-slate-50",
                      timeRange === "custom" && fromParam && "text-[#FDCA1C]",
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-3 border-b flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs font-medium text-muted-foreground">
                      Select Date Range
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="h-7 px-2 text-xs"
                      >
                        <X className="mr-1 h-3 w-3" /> Clear
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleApply}
                        disabled={!tempDate?.from || !tempDate?.to}
                        className="h-7 px-2 text-xs bg-[#FDCA1C] text-black hover:bg-[#e5b619]"
                      >
                        <Check className="mr-1 h-3 w-3" /> Apply
                      </Button>
                    </div>
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={tempDate}
                    onSelect={setTempDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <CardDescription>
            {timeRange === "custom" && fromParam && toParam
              ? `Range: ${format(parseISO(fromParam), "LLL dd")} - ${format(parseISO(toParam), "LLL dd, y")}`
              : "Daily user registrations over time."}
          </CardDescription>
        </div>

        <div className="flex">
          <div className="flex flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6 bg-slate-50/50 min-w-40">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Total Users
            </span>
            <span className="text-2xl leading-none font-bold sm:text-3xl text-black">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                totalRegistrations.toLocaleString()
              )}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:p-6 bg-white min-h-100">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-87.5 w-full animate-in fade-in duration-300"
        >
          <LineChart
            data={processedData}
            margin={{ left: 12, right: 12, top: 20 }}
            onClick={(state) => {
              if (state?.activePayload?.[0]?.payload?.date) {
                const clickedDate = state.activePayload[0].payload.date;
                router.push(`/admin/contacts?date=${clickedDate}`);
              }
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
              minTickGap={timeRange === "all" ? 60 : 15}
              tickFormatter={(value) => format(parseISO(value), "MMM d")}
            />
            <YAxis hide domain={[0, "auto"]} />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                return (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-2xl p-3 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(label), "EEEE, MMM dd, yyyy")}
                    </p>

                    <p className="text-sm font-semibold">
                      {payload[0].value} registrations
                    </p>

                    <p className="text-xs text-muted-foreground font-medium">
                      Click chart to view contacts
                    </p>
                  </div>
                );
              }}
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke={chartConfig.count.color}
              strokeWidth={2}
              dot={(props: DotProps) => {
                const { cx, cy, payload } = props;
                if (
                  payload &&
                  payload.count > 0 &&
                  processedData.length < 100
                ) {
                  return (
                    <circle
                      key={`dot-${payload.date}`}
                      cx={cx}
                      cy={cy}
                      r={3}
                      fill="#FDCA1C"
                    />
                  );
                }
                return (
                  <circle
                    key={`dot-hidden-${payload?.date || Math.random()}`}
                    r={0}
                  />
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
