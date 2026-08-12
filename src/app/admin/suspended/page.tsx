"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchAdminCustomers, updateAdminCustomer } from "@/lib/services/admin-api";
import { formatCurrency } from "@/lib/utils";

export default function SuspendedUsersPage() {
  const queryClient = useQueryClient();
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: fetchAdminCustomers,
  });

  const suspended = customers.filter((c) => c.status === "suspended");

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => updateAdminCustomer(id, { status: "active" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      toast.success("Customer reactivated");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not reactivate customer"),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Suspended Users</h1>
        <p className="text-sm text-muted-foreground">
          {suspended.length} customer{suspended.length === 1 ? "" : "s"} currently suspended — live from Postgres.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suspended accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : suspended.length === 0 ? (
            <EmptyState icon={UserX} title="No suspended users" description="Everyone currently has active access." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">KYC</th>
                    <th className="pb-2 font-medium">Joined</th>
                    <th className="pb-2 font-medium">Balance</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suspended.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </td>
                      <td className="py-3">
                        <Badge variant={c.kyc === "verified" ? "success" : "neutral"} className="capitalize">{c.kyc}</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{c.joined}</td>
                      <td className="py-3 font-mono tabular">{formatCurrency(c.balance)}</td>
                      <td className="py-3">
                        <Button size="sm" onClick={() => reactivateMutation.mutate(c.id)} disabled={reactivateMutation.isPending}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Reactivate
                        </Button>
                      </td>
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
