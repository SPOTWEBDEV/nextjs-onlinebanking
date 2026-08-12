"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Landmark, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  createPaymentAccount,
  deletePaymentAccount,
  fetchAdminPaymentAccounts,
  togglePaymentAccount,
} from "@/lib/services/admin-api";

export default function AdminPaymentAccountsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["admin", "payment-accounts"],
    queryFn: fetchAdminPaymentAccounts,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "payment-accounts"] });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => togglePaymentAccount(id, active),
    onSuccess: () => {
      invalidate();
      toast.success("Payment account updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentAccount,
    onSuccess: () => {
      invalidate();
      toast.success("Payment account removed");
    },
  });

  const createMutation = useMutation({
    mutationFn: createPaymentAccount,
    onSuccess: () => {
      invalidate();
      toast.success("Payment account added");
      setCreateOpen(false);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add payment account"),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Payment Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Deposit destinations shown to customers on the &quot;Bank Transfer&quot; tab. Every manual deposit against
            these is reviewed by an admin — never auto-confirmed.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Add payment account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active & inactive accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <EmptyState icon={Landmark} title="No payment accounts yet" description="Add one so customers can deposit via bank transfer." />
          ) : (
            <div className="space-y-2">
              {accounts.map((a) => (
                <div key={a.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{a.label}</p>
                      <Badge variant="neutral" className="capitalize">{a.type.replace("_", " ")}</Badge>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{a.details}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.active ? "success" : "neutral"}>{a.active ? "Active" : "Inactive"}</Badge>
                    <Button size="sm" variant="outline" onClick={() => toggleMutation.mutate({ id: a.id, active: !a.active })}>
                      {a.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(a.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-coral" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <h2 className="font-display text-lg font-semibold">Add payment account</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const label = (form.elements.namedItem("label") as HTMLInputElement).value;
            const type = (form.elements.namedItem("type") as HTMLSelectElement).value as "bank" | "crypto" | "mobile_money";
            const details = (form.elements.namedItem("details") as HTMLInputElement).value;
            createMutation.mutate({ label, type, details });
          }}
        >
          <div>
            <Label htmlFor="label">Label</Label>
            <Input id="label" name="label" placeholder="e.g. Banco Aurora Operations — Bank Transfer" required />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <select id="type" name="type" className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm">
              <option value="bank">Bank transfer</option>
              <option value="crypto">Crypto wallet</option>
              <option value="mobile_money">Mobile money</option>
            </select>
          </div>
          <div>
            <Label htmlFor="details">Details shown to customers</Label>
            <Input id="details" name="details" placeholder="IBAN, wallet address, or phone number" required />
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            Add account
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
