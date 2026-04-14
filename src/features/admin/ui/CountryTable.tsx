import { Globe, Trophy, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getCountryName } from "@/lib/countries";

interface CountryStat {
  country: string | null;
  count: number;
  percentage: number;
}

interface CountryTableProps {
  countries: CountryStat[];
}

export const CountryTable = ({ countries }: CountryTableProps) => {
  const sorted = [...countries].sort((a, b) => b.count - a.count);

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Header matched to Dashboard Style */}
      <div className="flex items-center justify-between border-b bg-slate-50/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-md border shadow-sm">
            <Globe className="size-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Geographic Distribution
            </h3>
            <p className="text-xs text-muted-foreground">
              User engagement by territory
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-600 border border-emerald-100">
          <TrendingUp className="size-3" />
          LIVE DATA
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50/30 text-left text-xs font-medium text-muted-foreground">
              <th className="px-6 py-3 font-medium">Rank</th>
              <th className="px-6 py-3 font-medium">Territory</th>
              <th className="px-6 py-3 font-medium">Users</th>
              <th className="px-6 py-3 text-right font-medium">Market Share</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sorted.map((c, i) => (
              <tr
                key={c.country ?? `unknown-${i}`}
                className="group transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  {i === 0 ? (
                    <Trophy className="size-4 text-amber-500" />
                  ) : (
                    <span className="text-xs font-mono text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-700">
                    {getCountryName(c.country)}{" "}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-muted-foreground">
                    {c.count.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="hidden sm:block w-24">
                      <Progress
                        value={Number(c.percentage)}
                        className="h-1.5"
                      />
                    </div>
                    <span className="min-w-10 text-right font-mono text-xs font-semibold text-slate-600">
                      {Number(c.percentage).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <div className="p-12 text-center text-muted-foreground text-sm">
          No geographic data available for this period.
        </div>
      )}
    </div>
  );
};
