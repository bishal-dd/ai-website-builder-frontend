import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
}: StatCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <h2 className="text-3xl font-bold text-slate-900">
          {value.toLocaleString()}
        </h2>
      </div>
      <div className={`rounded-xl p-3 ${colorClass}`}>
        <Icon className="size-6" />
      </div>
    </div>
    {/* Subtle hover decoration */}
    <div className="absolute -bottom-2 -right-2 size-12 translate-y-4 translate-x-4 rounded-full bg-slate-50 transition-transform group-hover:scale-150" />
  </div>
);
