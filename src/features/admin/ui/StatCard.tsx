import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  // We'll keep colorClass for the icon color, but refine how it's used
  colorClass?: string;
  onClick?: () => void;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass = "text-primary", // Default to theme primary
  onClick,
}: StatCardProps) => (
  <div
    onClick={onClick}
    className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:ring-1 hover:ring-slate-200"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground tracking-tight">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Icon container: simpler, matched to the header style but smaller */}
      <div
        className={`rounded-md border bg-slate-50/50 p-2.5 transition-colors group-hover:bg-white ${colorClass}`}
      >
        <Icon className="size-5" />
      </div>
    </div>

    {/* Subtle bottom accent line that appears on hover */}
    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/10 scale-x-0 transition-transform origin-left group-hover:scale-x-100" />
  </div>
);
