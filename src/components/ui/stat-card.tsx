import type { LucideIcon } from "lucide-react";
import { Card } from "./card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-100 text-emerald-600">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-2 font-mono text-xl font-semibold tabular">{value}</p>
      {trend && (
        <p className={cn("mt-1 text-xs font-medium", trendUp ? "text-emerald-600" : "text-coral")}>
          {trend}
        </p>
      )}
    </Card>
  );
}
