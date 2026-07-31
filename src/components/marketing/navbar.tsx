"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/lib/i18n/context";

export function MarketingNavbar() {
  const [open, setOpen] = React.useState(false);
  const { t } = useLanguage();

  const links = [
    { href: "/personal-banking", label: t.marketingNav.personal },
    { href: "/business-banking", label: t.marketingNav.business },
    { href: "/loan-services", label: t.marketingNav.loans },
    { href: "/investment", label: t.marketingNav.invest },
    { href: "/about", label: t.marketingNav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vault-gradient font-display text-sm font-bold text-gold-300">A</span>
          <span className="font-display text-lg font-semibold tracking-tight">Banco Aurora</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium">
            {t.nav.login}
          </Link>
          <Button asChild size="sm">
            <Link href="/register">{t.nav.openAccount}</Link>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="py-1 text-sm font-medium">
                {l.label}
              </Link>
            ))}
            <div className="flex items-center justify-between py-1">
              <Link href="/login" className="text-sm font-medium">
                {t.nav.login}
              </Link>
              <LanguageToggle />
            </div>
            <Link href="/register" className="mt-1 rounded-xl bg-emerald px-4 py-2.5 text-center text-sm font-medium text-white">
              {t.nav.openAccount}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
