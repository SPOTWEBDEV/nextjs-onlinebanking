"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAnalytics } from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalytics });
  const spendingByMonth = data?.spendingByMonth ?? [];
  const spendingByCategory = data?.spendingByCategory ?? [];

  const totalIncome = spendingByMonth.reduce((s, m) => s + m.income, 0);
  const totalExpenses = spendingByMonth.reduce((s, m) => s + m.expenses, 0);

  if (isLoading) {
    return (
      <div>
        <TopNav title={t.pages.analytics} back />
        <div className="space-y-4 px-5 py-4">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopNav title={t.pages.analytics} back />
      <div className="space-y-4 px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total income (6mo)</p>
            <p className="mt-1 font-mono text-lg font-semibold tabular text-emerald-600">{formatCurrency(totalIncome)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total expenses (6mo)</p>
            <p className="mt-1 font-mono text-lg font-semibold tabular text-coral">{formatCurrency(totalExpenses)}</p>
          </Card>
        </div>

        <Card className="p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Income vs Expenses</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingByMonth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" fill="#2FAE8B" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#0F6B5C" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Spending by category</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {spendingByCategory.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
