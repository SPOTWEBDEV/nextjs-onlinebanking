"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, FileText, User, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchKycQueue, resolveKyc } from "@/lib/services/admin-api";

export default function AdminKycPage() {
  const queryClient = useQueryClient();
  const { data: queue = [], isLoading } = useQuery({ queryKey: ["admin", "kyc"], queryFn: fetchKycQueue });

  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) => resolveKyc(id, action),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
      toast[vars.action === "approve" ? "success" : "error"](vars.action === "approve" ? "KYC approved" : "KYC sent back for resubmission");
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">KYC Verification</h1>
        <p className="text-sm text-muted-foreground">Review customers awaiting identity verification (live from Postgres).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending review ({queue.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}
          {!isLoading && queue.length === 0 && (
            <EmptyState icon={CheckCircle2} title="Queue is clear" description="No customers are currently awaiting KYC review." />
          )}
          {queue.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-100 text-emerald-600">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.email}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    Email {item.emailVerified ? "verified" : "unverified"} · Phone {item.phoneVerified ? "verified" : "unverified"} · Registered {item.submitted}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="warning" className="capitalize">{item.kycStatus}</Badge>
                <Button size="sm" onClick={() => mutation.mutate({ id: item.id, action: "approve" })} disabled={mutation.isPending}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => mutation.mutate({ id: item.id, action: "reject" })} disabled={mutation.isPending}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
