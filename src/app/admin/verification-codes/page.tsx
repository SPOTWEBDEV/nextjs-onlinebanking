"use client";

import { useQuery } from "@tanstack/react-query";
import { Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchVerificationCodes } from "@/lib/services/admin-api";
import { formatDate } from "@/lib/utils";

export default function AdminVerificationCodesPage() {
  const { data: codes = [], isLoading } = useQuery({
    queryKey: ["admin", "verification-codes"],
    queryFn: fetchVerificationCodes,
    refetchInterval: 15_000,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Verification Codes</h1>
        <p className="text-sm text-muted-foreground">
          There&apos;s no real email/SMS provider wired up in this demo. If a customer says they never
          received their email, phone, or sign-in code, look it up here and read it to them over
          support chat.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent codes (live from Postgres)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : codes.length === 0 ? (
            <EmptyState icon={KeyRound} title="No codes issued yet" description="Codes appear here as customers register, verify, or log in." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Purpose</th>
                    <th className="pb-2 font-medium">Sent to</th>
                    <th className="pb-2 font-medium">Code</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="py-2.5">
                        <p className="font-medium">{c.userName}</p>
                        <p className="text-xs text-muted-foreground">{c.userEmail}</p>
                      </td>
                      <td className="py-2.5 capitalize">{c.purpose}</td>
                      <td className="py-2.5 text-xs text-muted-foreground">{c.destination}</td>
                      <td className="py-2.5">
                        <button
                          className="flex items-center gap-1.5 font-mono text-base font-semibold tracking-widest tabular"
                          onClick={() => {
                            navigator.clipboard?.writeText(c.code);
                            toast.success("Code copied");
                          }}
                        >
                          {c.code}
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </td>
                      <td className="py-2.5">
                        {c.used ? (
                          <Badge variant="neutral">Used</Badge>
                        ) : c.expired ? (
                          <Badge variant="danger">Expired</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground">{formatDate(c.createdAt, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
