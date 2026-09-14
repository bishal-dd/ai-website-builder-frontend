export type InsightWebsite = {
  id: string;
  name: string;
  domain: string | null;
  createdAt: string;
  pageReloads: number;
  uniqueViewers: number;
};

export type InsightPeriod = "all_time" | "this_month" | "last_month";
