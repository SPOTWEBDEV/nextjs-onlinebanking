"use client";

import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchInvestments } from "@/lib/services/api";
import { cn, formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const performanceData = [
  { month: "Feb", value: 9800 },
  { month: "Mar", value: 10120 },
  { month: "Apr", value: 9950 },
  { month: "May", value: 10480 },
  { month: "Jun", value: 10890 },
  { month: "Jul", value: 11190.25 },
];

export default function InvestmentsPage() {
  const { t } = useLanguage();
  const { data: investmentHoldings = [] } = useQuery({ queryKey: ["investments"], queryFn: fetchInvestments });

  const totalValue = investmentHoldings.reduce((sum, h) => sum + h.value, 0);
  const totalCost = investmentHoldings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalPl = totalValue - totalCost;
  const totalPlPct = totalCost ? (totalPl / totalCost) * 100 : 0;

  return (
    <div>
      <TopNav title={t.pages.investments} back />

      <div className="px-5 py-4">
        <Card className="bg-vault-gradient p-5 text-white">
          <p className="text-xs uppercase tracking-wider text-white/70">Portfolio value</p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular">{formatCurrency(totalValue)}</p>
          <p className={cn("mt-1 flex items-center gap-1 text-sm font-medium", totalPl >= 0 ? "text-mint-400" : "text-coral-100")}>
            {totalPl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {totalPl >= 0 ? "+" : ""}
            {formatCurrency(totalPl)} ({totalPlPct.toFixed(1)}%)
          </p>
        </Card>

        <Card className="mt-4 p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">6-month performance</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="invGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2FAE8B" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2FAE8B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid #EEF2F7" }}
                />
                <Area type="monotone" dataKey="value" stroke="#0F6B5C" strokeWidth={2} fill="url(#invGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Holdings</p>
          {investmentHoldings.map((h) => (
            <Card key={h.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.ticker} · {h.units} units</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold tabular">{formatCurrency(h.value)}</p>
                <Badge variant={h.changePct >= 0 ? "success" : "danger"} className="mt-1">
                  {h.changePct >= 0 ? "+" : ""}
                  {h.changePct.toFixed(1)}%
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
