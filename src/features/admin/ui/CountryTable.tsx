import { Globe, Trophy } from "lucide-react";

interface RadialProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
}

interface CountryStat {
  country: string | null;
  count: number;
  percentage: number;
}

interface CountryTableProps {
  countries: CountryStat[];
}
const RadialProgress = ({
  percentage,
  size = 48,
  strokeWidth = 4,
  colorClass = "text-blue-600",
}: RadialProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="-rotate-90 transform" width={size} height={size}>
        <circle
          className="text-slate-100"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-in-out`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-slate-700">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};
export const CountryTable = ({ countries }: CountryTableProps) => {
  const sorted = [...countries].sort((a, b) => b.count - a.count);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between bg-slate-50/50 px-8 py-6">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Globe className="size-5 text-blue-500" />
            Market Distribution
          </h3>
          <p className="text-xs font-medium text-slate-400">
            Regional user engagement metrics
          </p>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 tracking-wider">
          REAL-TIME
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/30 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-4">Rank</th>
              <th className="px-8 py-4">Territory</th>
              <th className="px-8 py-4 text-center">Engagement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((c, i) => (
              <tr
                key={c.country}
                className="group transition-colors hover:bg-blue-50/30"
              >
                <td className="px-8 py-4">
                  <span
                    className={`text-xs font-bold ${i === 0 ? "text-blue-600" : "text-slate-300"}`}
                  >
                    {i === 0 ? <Trophy className="size-4" /> : `#${i + 1}`}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">
                      {c.country ?? "Unknown"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {c.count.toLocaleString()} active users
                    </span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex justify-center">
                    <RadialProgress
                      percentage={Number(c.percentage)}
                      colorClass={i === 0 ? "text-blue-600" : "text-slate-400"}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
