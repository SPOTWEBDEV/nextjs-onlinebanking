"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterValues } from "@/lib/validations";
import { registerUser } from "@/lib/services/api";
import { useLanguage } from "@/lib/i18n/context";
import { useRedirectIfAuthenticated } from "@/lib/use-redirect-if-authenticated";
import { CUSTOMER_SESSION_KEY } from "@/lib/session-check";

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const redirecting = useRedirectIfAuthenticated(CUSTOMER_SESSION_KEY, "/dashboard");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: (values: RegisterValues) => registerUser(values),
    onSuccess: (data) => {
      toast.success("Account created — verify your email to continue");
      router.push(`/verify-email?userId=${data.userId}`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not create account"),
  });

  if (redirecting) return null;

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t.auth.registerTitle}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{t.auth.registerSubtitle}</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <div>
          <Label htmlFor="fullName">{t.auth.fullName}</Label>
          <Input id="fullName" placeholder="Mariana Costa" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-xs text-coral">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">{t.auth.email}</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-coral">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">{t.auth.phone}</Label>
          <Input id="phone" type="tel" placeholder="+351 912 345 678" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-coral">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">{t.auth.password}</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-coral">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-coral">{errors.confirmPassword.message}</p>}
        </div>
        <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-input" {...register("agree")} />
          {t.auth.agreePrefix}{" "}
          <Link href="/terms" className="font-medium text-emerald-600">
            {t.auth.terms}
          </Link>{" "}
          {t.auth.and}{" "}
          <Link href="/privacy-policy" className="font-medium text-emerald-600">
            {t.auth.privacyPolicy}
          </Link>
          .
        </label>
        {errors.agree && <p className="text-xs text-coral">{errors.agree.message}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t.auth.createAccountButton}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t.auth.alreadyHaveAccount}{" "}
        <Link href="/login" className="font-medium text-emerald-600">
          {t.auth.logIn}
        </Link>
      </p>
    </div>
  );
}
