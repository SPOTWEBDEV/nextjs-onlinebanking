"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const reportTypes = [
  "Transactions",
  "Revenue",
  "Customers",
  "Deposits",
  "Withdrawals",
  "Loans",
  "Cards",
];

export default function AdminReportsPage() {
  const [selected, setSelected] = useState<string[]>(["Transactions"]);

  const toggle = (r: string) => {
    setSelected((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export reports across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select report types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((r) => (
              <button
                key={r}
                onClick={() => toggle(r)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium",
                  selected.includes(r) ? "border-emerald bg-mint-100 text-emerald-600" : "border-border text-muted-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success(`Exported ${selected.length} report(s) as PDF`)}>
              <FileText className="h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => toast.success(`Exported ${selected.length} report(s) as Excel`)}>
              <FileSpreadsheet className="h-4 w-4" /> Export Excel
            </Button>
            <Button variant="outline" onClick={() => toast.success(`Exported ${selected.length} report(s) as CSV`)}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { name: "Q2 2026 Transaction Report.pdf", date: "Jul 1, 2026" },
            { name: "June Revenue Summary.xlsx", date: "Jul 1, 2026" },
            { name: "Customer Growth — H1 2026.csv", date: "Jun 30, 2026" },
          ].map((f) => (
            <div key={f.name} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>{f.name}</span>
              <span className="text-xs text-muted-foreground">{f.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
