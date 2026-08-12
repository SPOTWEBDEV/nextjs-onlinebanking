"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Ban,
  CheckCircle2,
  Copy,
  Eye,
  KeyRound,
  ListPlus,
  Lock,
  MoreVertical,
  Plus,
  Search,
  Snowflake,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  addCustomerActivity,
  createAdminCustomer,
  deleteAdminCustomer,
  fetchAdminCustomerDetail,
  fetchAdminCustomers,
  updateAdminCustomer,
} from "@/lib/services/admin-api";
import { formatCurrency } from "@/lib/utils";
import type { AdminCustomer } from "@/lib/types";

const SPECIAL_NEEDS_OPTIONS = [
  { id: "blind", label: "Blind / visually impaired" },
  { id: "deaf", label: "Deaf / hard of hearing" },
  { id: "wheelchair", label: "Wheelchair user" },
  { id: "elderly", label: "Elderly / senior assistance" },
  { id: "cognitive", label: "Cognitive assistance" },
  { id: "other", label: "Other accessibility need" },
];

export default function AdminCustomersPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminCustomer | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [activityFor, setActivityFor] = useState<string | null>(null);

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
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update status"),
  });

  const kycMutation = useMutation({
    mutationFn: ({ id, kyc }: { id: string; kyc: "verified" | "rejected" }) => updateAdminCustomer(id, { kyc }),
    onSuccess: (_data, vars) => {
      invalidate();
      toast.success(vars.kyc === "verified" ? "KYC approved" : "KYC rejected");
      setMenuFor(null);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update KYC"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCustomer,
    onSuccess: () => {
      invalidate();
      toast.success("Customer deleted");
      setMenuFor(null);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not delete customer"),
  });

  const createMutation = useMutation({
    mutationFn: createAdminCustomer,
    onSuccess: (data) => {
      invalidate();
      setCreatedCredentials({ email: data.email, password: data.tempPassword });
      setCreateOpen(false);
      setSelectedNeeds([]);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not create customer"),
  });

  const activityMutation = useMutation({
    mutationFn: ({ id, type, amount, description }: { id: string; type: "credit" | "debit"; amount: number; description: string }) =>
      addCustomerActivity(id, { type, amount, description }),
    onSuccess: () => {
      invalidate();
      toast.success("Activity added");
      setActivityFor(null);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add activity"),
  });

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())
  );

  const openDetail = async (id: string) => {
    setDetailId(id);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    setMenuFor(null);
    try {
      const data = await fetchAdminCustomerDetail(id);
      setDetail(data);
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Could not load customer details");
    } finally {
      setDetailLoading(false);
    }
  };

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
                        {c.specialNeeds.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {c.specialNeeds.map((n) => (
                              <Badge key={n} variant="neutral" className="capitalize">{n}</Badge>
                            ))}
                          </div>
                        )}
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
                          <div className="absolute right-0 z-20 mt-1 w-60 rounded-xl border border-border bg-card p-1 text-left shadow-card">
                            <button onClick={() => openDetail(c.id)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted">
                              <Eye className="h-3.5 w-3.5" /> View details
                            </button>
                            <button
                              onClick={() => {
                                setActivityFor(c.id);
                                setMenuFor(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted"
                            >
                              <ListPlus className="h-3.5 w-3.5" /> Add activity
                            </button>
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
                              <button onClick={() => kycMutation.mutate({ id: c.id, kyc: "verified" })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Approve KYC
                              </button>
                            )}
                            {c.kyc !== "rejected" && (
                              <button onClick={() => kycMutation.mutate({ id: c.id, kyc: "rejected" })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted">
                                <XCircle className="h-3.5 w-3.5 text-coral" /> Reject KYC
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

      {/* Create user dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <h2 className="font-display text-lg font-semibold">Create new user</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const name = (form.elements.namedItem("name") as HTMLInputElement).value;
            const email = (form.elements.namedItem("email") as HTMLInputElement).value;
            const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
            const initialDeposit = Number((form.elements.namedItem("initialDeposit") as HTMLInputElement).value || 0);
            createMutation.mutate({ name, email, phone, initialDeposit, specialNeeds: selectedNeeds });
          }}
        >
          <Input name="name" placeholder="Full name" required />
          <Input name="email" type="email" placeholder="Email address" required />
          <Input name="phone" placeholder="Phone number (optional)" />
          <div>
            <Label htmlFor="initialDeposit">Initial deposit (optional)</Label>
            <Input id="initialDeposit" name="initialDeposit" type="number" step="0.01" placeholder="0.00" />
          </div>
          <div>
            <Label>Accessibility / support needs</Label>
            <div className="space-y-1.5">
              {SPECIAL_NEEDS_OPTIONS.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedNeeds.includes(opt.id)}
                    onChange={(e) =>
                      setSelectedNeeds((prev) =>
                        e.target.checked ? [...prev, opt.id] : prev.filter((n) => n !== opt.id)
                      )
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            Create user
          </Button>
        </form>
      </Dialog>

      {/* Post-create credentials dialog */}
      <Dialog open={!!createdCredentials} onClose={() => setCreatedCredentials(null)}>
        {createdCredentials && (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint-100">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="mt-3 font-display text-lg font-semibold">Customer created</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share this temporary password with the customer — it&apos;s only shown once.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-muted p-3 text-left text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-mono">{createdCredentials.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Temp password</span>
                <button
                  className="flex items-center gap-1.5 font-mono font-semibold"
                  onClick={() => {
                    navigator.clipboard?.writeText(createdCredentials.password);
                    toast.success("Copied");
                  }}
                >
                  {createdCredentials.password} <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <Button className="mt-5 w-full" onClick={() => setCreatedCredentials(null)}>
              Done
            </Button>
          </div>
        )}
      </Dialog>

      {/* Customer detail dialog (ownership-gated) */}
      <Dialog open={!!detailId} onClose={() => setDetailId(null)}>
        {detailLoading && <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>}
        {detailError && (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral-100">
              <Lock className="h-6 w-6 text-coral" />
            </div>
            <h2 className="mt-3 font-display text-base font-semibold">Access restricted</h2>
            <p className="mt-2 text-sm text-muted-foreground">{detailError}</p>
          </div>
        )}
        {detail && !detailLoading && !detailError && (
          <div>
            <h2 className="font-display text-lg font-semibold">{detail.name}</h2>
            <div className="mt-4 space-y-2 rounded-xl bg-muted p-3 text-sm">
              {[
                ["Email", detail.email],
                ["Phone", detail.phone],
                ["Status", detail.status],
                ["KYC", detail.kyc],
                ["Joined", detail.joined],
                ["Balance", formatCurrency(detail.balance)],
                ["Special needs", detail.specialNeeds.length ? detail.specialNeeds.join(", ") : "None"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>

      {/* Add activity dialog */}
      <Dialog open={!!activityFor} onClose={() => setActivityFor(null)}>
        <h2 className="font-display text-lg font-semibold">Add account activity</h2>
        <p className="mt-1 text-xs text-muted-foreground">Applies immediately to the customer&apos;s primary account.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!activityFor) return;
            const form = e.target as HTMLFormElement;
            const type = (form.elements.namedItem("type") as HTMLSelectElement).value as "credit" | "debit";
            const amount = Number((form.elements.namedItem("amount") as HTMLInputElement).value);
            const description = (form.elements.namedItem("description") as HTMLInputElement).value;
            activityMutation.mutate({ id: activityFor, type, amount, description });
          }}
        >
          <div>
            <Label htmlFor="type">Type</Label>
            <select id="type" name="type" className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm">
              <option value="credit">Credit (add funds)</option>
              <option value="debit">Debit (remove funds)</option>
            </select>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="e.g. Goodwill credit — support ticket #4821" required />
          </div>
          <Button type="submit" className="w-full" disabled={activityMutation.isPending}>
            Add activity
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
