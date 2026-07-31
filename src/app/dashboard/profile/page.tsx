"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FileCheck2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";
import { profileSchema, type ProfileValues } from "@/lib/validations";
import { delay } from "@/lib/utils";

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
      address: "Rua das Flores 42, Lisboa, Portugal",
    },
  });

  const mutation = useMutation({
    mutationFn: async (_v: ProfileValues) => {
      await delay(700);
      return { ok: true };
    },
    onSuccess: () => toast.success("Profile updated"),
  });

  return (
    <div>
      <TopNav title="Profile" back />
      <div className="space-y-4 px-5 py-4">
        <Card className="flex flex-col items-center p-6 text-center">
          <Avatar initials={currentUser.avatarInitials} className="h-16 w-16 text-lg" />
          <p className="mt-3 font-display text-base font-semibold">{currentUser.fullName}</p>
          <div className="mt-2 flex gap-2">
            <Badge variant="success" className="capitalize">{currentUser.kycStatus}</Badge>
            <Badge variant="warning" className="capitalize">{currentUser.tier}</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <FileCheck2 className="h-4 w-4 text-emerald-600" /> KYC Documents
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
              <span>Government ID</span>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
              <span>Proof of address</span>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
              <span>Selfie verification</span>
              <Badge variant="success">Verified</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <form className="space-y-3" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && <p className="mt-1 text-xs text-coral">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-coral">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="mt-1 text-xs text-coral">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="mt-1 text-xs text-coral">{errors.address.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
