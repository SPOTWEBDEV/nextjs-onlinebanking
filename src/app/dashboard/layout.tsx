"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/nav/bottom-nav";
import { useSessionStore } from "@/lib/store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Zustand persist rehydrates on mount; give it a tick before redirecting.
    const t = setTimeout(() => setChecked(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (checked && !isAuthenticated) {
      router.replace("/login");
    }
  }, [checked, isAuthenticated, router]);

  return (
    <div className="app-shell pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
