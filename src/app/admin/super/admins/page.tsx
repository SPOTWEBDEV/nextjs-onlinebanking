"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Ban, CheckCircle2, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchAdmins, updateAdminStatus } from "@/lib/services/admin-api";
import { useAdminSessionStore } from "@/lib/admin-store";

export default function ManageAdminsPage() {
  const queryClient = useQueryClient();
  const currentAdmin = useAdminSessionStore((s) => s.admin);
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin", "admins"],
    queryFn: fetchAdmins,
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: "active" | "suspended"; reason?: string }) =>
      updateAdminStatus(id, status, reason),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
      toast.success(vars.status === "suspended" ? "Admin suspended" : "Admin reactivated");
      setSuspendTarget(null);
      setReason("");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update admin"),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Manage Admins</h1>
        <p className="text-sm text-muted-foreground">
          Suspend or reactivate admin accounts — visible only to super admins.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All admins</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : admins.length === 0 ? (
            <EmptyState icon={UserCog} title="No admins yet" description="Admins who register will appear here." />
          ) : (
            <div className="space-y-2">
              {admins.map((a) => (
                <div key={a.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {a.fullName} {a.id === currentAdmin?.id && <span className="text-xs text-muted-foreground">(you)</span>}
                      </p>
                      <Badge variant={a.role === "super_admin" ? "warning" : "neutral"} className="capitalize">
                        {a.role.replace("_", " ")}
                      </Badge>
                      <Badge variant={a.status === "active" ? "success" : "danger"} className="capitalize">
                        {a.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{a.email} · {a.usersCreated} customers created · joined {a.createdAt}</p>
                    {a.status === "suspended" && a.suspensionReason && (
                      <p className="mt-1 text-xs text-coral">Reason: {a.suspensionReason}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {a.role !== "super_admin" && a.id !== currentAdmin?.id && (
                      a.status === "active" ? (
                        <Button size="sm" variant="destructive" onClick={() => setSuspendTarget(a.id)}>
                          <Ban className="h-3.5 w-3.5" /> Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => suspendMutation.mutate({ id: a.id, status: "active" })}
                          disabled={suspendMutation.isPending}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Reactivate
                        </Button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!suspendTarget} onClose={() => setSuspendTarget(null)}>
        <h2 className="font-display text-lg font-semibold">Suspend admin</h2>
        <p className="mt-1 text-sm text-muted-foreground">This admin will be logged out immediately and unable to sign back in.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!suspendTarget) return;
            suspendMutation.mutate({ id: suspendTarget, status: "suspended", reason });
          }}
        >
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Policy violation, under investigation"
              required
            />
          </div>
          <Button type="submit" variant="destructive" className="w-full" disabled={suspendMutation.isPending}>
            Suspend admin
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
