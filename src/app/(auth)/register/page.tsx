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
import { delay } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: async (_values: RegisterValues) => {
      await delay(900);
      return { ok: true };
    },
    onSuccess: () => {
      toast.success("Account created — verify your email to continue");
      router.push("/verify-email");
    },
  });

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Takes about two minutes. No paperwork.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" placeholder="Mariana Costa" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-xs text-coral">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-coral">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" type="tel" placeholder="+351 912 345 678" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-coral">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-coral">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-coral">{errors.confirmPassword.message}</p>}
        </div>
        <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-input" {...register("agree")} />
          I agree to the{" "}
          <Link href="/terms" className="font-medium text-emerald-600">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="font-medium text-emerald-600">
            Privacy Policy
          </Link>
          .
        </label>
        {errors.agree && <p className="text-xs text-coral">{errors.agree.message}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-600">
          Log in
        </Link>
      </p>
    </div>
  );
}
