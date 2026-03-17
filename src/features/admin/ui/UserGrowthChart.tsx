"use client";

import * as React from "react";
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
import { TrendingUp, Calendar as CalendarIcon } from "lucide-react";
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
  ChartTooltipContent,
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

export function UserGrowthChart() {
  const [timeRange, setTimeRange] = React.useState("this-month");
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const range = React.useMemo(() => {
    const now = new Date();
    if (timeRange === "custom" && date?.from && date?.to) {
      return {
        start: format(date.from, "yyyy-MM-dd"),
        end: format(date.to, "yyyy-MM-dd"),
      };
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
  }, [timeRange, date]);

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

  const handleRangeChange = (value: string) => {
    setTimeRange(value);
    if (value === "custom") {
      setTimeout(() => setCalendarOpen(true), 100);
    } else {
      setCalendarOpen(false);
      setDate(undefined);
    }
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
              <Select value={timeRange} onValueChange={handleRangeChange}>
                <SelectTrigger className="w-[140px] h-8 text-xs border-none bg-slate-50">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-8 w-8 border-none bg-slate-50",
                      timeRange === "custom" &&
                        date?.from &&
                        date?.to &&
                        "text-[#FDCA1C]",
                    )}
                    onClick={() => {
                      if (timeRange !== "custom") setTimeRange("custom");
                      setCalendarOpen(true);
                    }}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate?.from && newDate?.to) setCalendarOpen(false);
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <CardDescription>
            {timeRange === "custom" && date?.from && date?.to
              ? `Range: ${format(date.from, "LLL dd")} - ${format(date.to, "LLL dd, y")}`
              : "Daily user registrations over time."}
          </CardDescription>
        </div>

        <div className="flex">
          <div className="flex flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6 bg-slate-50/50 min-w-[160px]">
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

      <CardContent className="px-2 pt-4 sm:p-6 bg-white min-h-[400px]">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full animate-in fade-in duration-300"
        >
          <LineChart
            data={processedData}
            margin={{ left: 12, right: 12, top: 20 }}
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
              content={
                <ChartTooltipContent
                  className="w-[180px] rounded-xl border-slate-200 shadow-2xl bg-white"
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
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.count > 0 && processedData.length < 100) {
                  return <circle cx={cx} cy={cy} r={3} fill="#FDCA1C" />;
                }
                return <></>;
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
