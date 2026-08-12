"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, FileCheck2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";
import { useSessionStore } from "@/lib/store";
import { fetchMe } from "@/lib/services/api";
import { profileSchema, type ProfileValues } from "@/lib/validations";
import { delay } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

export default function ProfilePage() {
  const { t } = useLanguage();
  const sessionUser = useSessionStore((s) => s.user);
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const user = me ?? sessionUser ?? currentUser;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: "Rua das Flores 42, Lisboa, Portugal",
    },
  });

  useEffect(() => {
    if (me) {
      reset({ fullName: me.fullName, email: me.email, phone: me.phone, address: "Rua das Flores 42, Lisboa, Portugal" });
    }
  }, [me, reset]);

  const mutation = useMutation({
    mutationFn: async (_v: ProfileValues) => {
      await delay(700);
      return { ok: true };
    },
    onSuccess: () => toast.success("Profile updated"),
  });

  return (
    <div>
      <TopNav title={t.pages.profile} back />
      <div className="space-y-4 px-5 py-4">
        <Card className="flex flex-col items-center p-6 text-center">
          <Avatar initials={user.avatarInitials} className="h-16 w-16 text-lg" />
          <p className="mt-3 font-display text-base font-semibold">{user.fullName}</p>
          <div className="mt-2 flex gap-2">
            <Badge variant={user.kycStatus === "verified" ? "success" : user.kycStatus === "pending" ? "warning" : "danger"} className="capitalize">
              {user.kycStatus}
            </Badge>
            <Badge variant="warning" className="capitalize">{user.tier}</Badge>
          </div>
        </Card>

        <Link href="/dashboard/kyc">
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FileCheck2 className="h-4 w-4 text-emerald-600" /> Identity Verification
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.kycStatus === "verified" ? "success" : user.kycStatus === "pending" ? "warning" : "danger"} className="capitalize">
                {user.kycStatus}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
        </Link>

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
