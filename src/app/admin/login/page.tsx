"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/lib/services/admin-api";
import { useAdminSessionStore } from "@/lib/admin-store";
import { useRedirectIfAuthenticated } from "@/lib/use-redirect-if-authenticated";
import { ADMIN_SESSION_KEY } from "@/lib/session-check";

export default function AdminLoginPage() {
  const router = useRouter();
  const redirecting = useRedirectIfAuthenticated(ADMIN_SESSION_KEY, "/admin");
  const login = useAdminSessionStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const admin = await loginAdmin(email, password);
      login(admin);
      toast.success(`Welcome back, ${admin.fullName.split(" ")[0]}`);
      router.push(admin.role === "super_admin" ? "/admin/super" : "/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) return null;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vault-gradient text-gold-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold text-white">Banco Aurora Admin</h1>
          <p className="mt-1 text-sm text-white/60">Staff sign-in only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-ink-900 p-6">
          <div>
            <Label htmlFor="email" className="text-white/70">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bancoaurora.example"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white/70">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Need staff access?{" "}
          <Link href="/admin/register" className="font-medium text-mint-400">
            Register an admin account
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-white/30">
          Demo super admin: support@spotwebtech.com.ng
        </p>
      </div>
    </div>
  );
}
