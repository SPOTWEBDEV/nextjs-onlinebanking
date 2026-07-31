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
import { mockLogin } from "@/lib/services/api";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: (values: LoginValues) => mockLogin(values.email, values.password),
    onSuccess: () => {
      toast.success("Credentials verified");
      router.push("/otp?next=/dashboard&purpose=login");
    },
    onError: () => toast.error("Invalid email or password"),
  });

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Log in to your Banco Aurora account.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-coral">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="mb-1.5 text-xs font-medium text-emerald-600">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-coral">{errors.password.message}</p>}
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Log in
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
          <Fingerprint className="h-4 w-4" /> Use biometrics
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to Banco Aurora?{" "}
        <Link href="/register" className="font-medium text-emerald-600">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Demo tip: any valid-looking email + 8+ character password will work.
      </p>
    </div>
  );
}
