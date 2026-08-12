"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Star, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  addBeneficiary,
  fetchBeneficiaries,
  removeBeneficiary,
  toggleFavouriteBeneficiary,
} from "@/lib/services/api";
import { beneficiarySchema, type BeneficiaryValues } from "@/lib/validations";
import { useLanguage } from "@/lib/i18n/context";

export default function BeneficiariesPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: beneficiaries, isLoading } = useQuery({ queryKey: ["beneficiaries"], queryFn: fetchBeneficiaries });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BeneficiaryValues>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: { currency: "USD", type: "local" },
  });

  const addMutation = useMutation({
    mutationFn: addBeneficiary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      toast.success("Beneficiary added");
      reset();
      setOpen(false);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeBeneficiary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      toast.success("Beneficiary removed");
    },
  });

  const favouriteMutation = useMutation({
    mutationFn: toggleFavouriteBeneficiary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["beneficiaries"] }),
  });

  return (
    <div>
      <TopNav title={t.pages.beneficiaries} back />

      <div className="px-5 py-4">
        <Button className="mb-4 w-full" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add beneficiary
        </Button>

        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && beneficiaries?.length === 0 && (
          <EmptyState icon={Users} title="No beneficiaries yet" description="Add someone to start sending transfers." />
        )}

        <div className="space-y-2">
          {beneficiaries?.map((b) => (
            <Card key={b.id} className="flex items-center justify-between p-3.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">{b.name}</p>
                  <Badge variant="neutral" className="capitalize">{b.type}</Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {b.bank} · {b.accountNumber}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => favouriteMutation.mutate(b.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                  aria-label="Toggle favourite"
                >
                  <Star className={b.favourite ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-muted-foreground"} />
                </button>
                <button
                  onClick={() => removeMutation.mutate(b.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-coral hover:bg-coral-100"
                  aria-label="Remove beneficiary"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <h2 className="font-display text-lg font-semibold">Add beneficiary</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit((v) => addMutation.mutate(v))}>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-coral">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="bank">Bank name</Label>
            <Input id="bank" {...register("bank")} />
            {errors.bank && <p className="mt-1 text-xs text-coral">{errors.bank.message}</p>}
          </div>
          <div>
            <Label htmlFor="accountNumber">Account number</Label>
            <Input id="accountNumber" {...register("accountNumber")} />
            {errors.accountNumber && <p className="mt-1 text-xs text-coral">{errors.accountNumber.message}</p>}
          </div>
          <div>
            <Label htmlFor="type">Transfer type</Label>
            <select id="type" className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm" {...register("type")}>
              <option value="internal">Internal (Banco Aurora)</option>
              <option value="local">Local bank</option>
              <option value="international">International</option>
            </select>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={addMutation.isPending}>
            Save beneficiary
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
