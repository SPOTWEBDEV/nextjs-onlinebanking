"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Fingerprint, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { loginUser } from "@/lib/services/api";
import { useLanguage } from "@/lib/i18n/context";
import { useRedirectIfAuthenticated } from "@/lib/use-redirect-if-authenticated";
import { CUSTOMER_SESSION_KEY } from "@/lib/session-check";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const redirecting = useRedirectIfAuthenticated(CUSTOMER_SESSION_KEY, "/dashboard");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: (values: LoginValues) => loginUser(values.email, values.password),
    onSuccess: (data) => {
      toast.success("Credentials verified");
      router.push(`/otp?next=/dashboard&purpose=login&userId=${data.userId}`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Invalid email or password"),
  });

  if (redirecting) return null;

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t.auth.welcomeBack}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{t.auth.loginSubtitle}</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <div>
          <Label htmlFor="email">{t.auth.email}</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-coral">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Link href="/forgot-password" className="mb-1.5 text-xs font-medium text-emerald-600">
              {t.auth.forgotPassword}
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-coral">{errors.password.message}</p>}
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t.auth.loginButton}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            toast.info("Face ID / fingerprint placeholder — no biometric hardware in this demo");
          }}
        >
          <Fingerprint className="h-4 w-4" /> {t.auth.useBiometrics}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t.auth.newToBank}{" "}
        <Link href="/register" className="font-medium text-emerald-600">
          {t.auth.createAccount}
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">{t.auth.loginDemoTip}</p>
    </div>
  );
}
