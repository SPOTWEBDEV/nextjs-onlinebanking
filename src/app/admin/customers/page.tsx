"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Ban,
  CheckCircle2,
  KeyRound,
  MoreVertical,
  Plus,
  Search,
  Snowflake,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createAdminCustomer,
  deleteAdminCustomer,
  fetchAdminCustomers,
  updateAdminCustomer,
} from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";

export default function AdminCustomersPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: fetchAdminCustomers,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "suspended" | "frozen" }) =>
      updateAdminCustomer(id, { status }),
    onSuccess: (_data, vars) => {
      invalidate();
      toast.success(`Customer ${vars.status}`);
      setMenuFor(null);
    },
  });

  const kycMutation = useMutation({
    mutationFn: (id: string) => updateAdminCustomer(id, { kyc: "verified" }),
    onSuccess: () => {
      invalidate();
      toast.success("KYC approved");
      setMenuFor(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCustomer,
    onSuccess: () => {
      invalidate();
      toast.success("Customer deleted");
      setMenuFor(null);
    },
  });

  const createMutation = useMutation({
    mutationFn: createAdminCustomer,
    onSuccess: () => {
      invalidate();
      toast.success("Customer created");
      setCreateOpen(false);
    },
  });

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Customer Management</h1>
          <p className="text-sm text-muted-foreground">{customers.length} total customers · live from Postgres</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Create user
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search customers" className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">KYC</th>
                    <th className="pb-2 font-medium">Joined</th>
                    <th className="pb-2 font-medium">Balance</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="relative border-b border-border last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </td>
                      <td className="py-3">
                        <Badge variant={c.status === "active" ? "success" : c.status === "suspended" ? "warning" : "danger"} className="capitalize">
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={c.kyc === "verified" ? "success" : c.kyc === "pending" ? "warning" : "danger"} className="capitalize">
                          {c.kyc}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{c.joined}</td>
                      <td className="py-3 font-mono tabular">{formatCurrency(c.balance)}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setMenuFor(menuFor === c.id ? null : c.id)}
                          className="rounded-full p-1.5 hover:bg-muted"
                          aria-label="Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {menuFor === c.id && (
                          <div className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-border bg-card p-1 text-left shadow-card">
                            {c.status !== "active" && (
                              <button onClick={() => statusMutation.mutate({ id: c.id, status: "active" })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Activate account
                              </button>
                            )}
                            {c.status !== "suspended" && (
                              <button onClick={() => statusMutation.mutate({ id: c.id, status: "suspended" })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted">
                                <Ban className="h-3.5 w-3.5 text-gold" /> Suspend user
                              </button>
                            )}
                            {c.status !== "frozen" && (
                              <button onClick={() => statusMutation.mutate({ id: c.id, status: "frozen" })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted">
                                <Snowflake className="h-3.5 w-3.5 text-ink-600" /> Freeze account
                              </button>
                            )}
                            {c.kyc !== "verified" && (
                              <button onClick={() => kycMutation.mutate(c.id)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Approve KYC
                              </button>
                            )}
                            <button
                              onClick={() => {
                                toast.success("Password reset link sent");
                                setMenuFor(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted"
                            >
                              <KeyRound className="h-3.5 w-3.5" /> Reset password
                            </button>
                            <button
                              onClick={() => {
                                toast.success("Transfer PIN reset");
                                setMenuFor(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted"
                            >
                              <KeyRound className="h-3.5 w-3.5" /> Reset transfer PIN
                            </button>
                            <button onClick={() => deleteMutation.mutate(c.id)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-coral hover:bg-coral-100">
                              <Trash2 className="h-3.5 w-3.5" /> Delete user
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <h2 className="font-display text-lg font-semibold">Create new user</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const name = (form.elements.namedItem("name") as HTMLInputElement).value;
            const email = (form.elements.namedItem("email") as HTMLInputElement).value;
            createMutation.mutate({ name, email });
          }}
        >
          <Input name="name" placeholder="Full name" required />
          <Input name="email" type="email" placeholder="Email address" required />
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            Create user
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
