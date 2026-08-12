"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  PiggyBank,
  LineChart,
  Building2,
  Fingerprint,
  Bell,
  CreditCard,
  Landmark,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VaultCard } from "@/components/ui/vault-card";
import { useLanguage } from "@/lib/i18n/context";
import { landingContent } from "@/lib/i18n/landing-content";
import { useRedirectIfAuthenticated } from "@/lib/use-redirect-if-authenticated";
import { CUSTOMER_SESSION_KEY } from "@/lib/session-check";

const productIcons = [Smartphone, Building2, LineChart, PiggyBank];
const productHrefs = ["/personal-banking", "/business-banking", "/investment", "/savings-accounts"];
const securityIcons = [Zap, Fingerprint, Bell, CreditCard];

export default function LandingPage() {
  const { lang, t } = useLanguage();
  const c = landingContent[lang];

  // If there's already a logged-in session in localStorage, skip the
  // marketing page entirely instead of showing it again before bouncing to
  // the dashboard.
  const redirecting = useRedirectIfAuthenticated(CUSTOMER_SESSION_KEY, "/dashboard");
  if (redirecting) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-mint-100/40 to-transparent dark:from-emerald-600/10" />
        <div className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-emerald-600">
              <Sparkles className="h-3.5 w-3.5" /> {t.landing.badge}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              {t.landing.title1}
              <span className="bg-gradient-to-r from-emerald to-mint-500 bg-clip-text text-transparent"> {t.landing.title2}</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">{t.landing.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  {t.landing.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/personal-banking">{t.landing.ctaSecondary}</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">{t.landing.disclaimer}</p>
          </div>

          <div className="relative mx-auto w-full max-w-[300px] animate-scale-in md:max-w-[340px]">
            <div className="rounded-[2.5rem] border-8 border-ink-950 bg-ink-950 p-1 shadow-card">
              <div className="rounded-[2rem] bg-porcelain p-4 dark:bg-ink-900">
                <VaultCard label={c.heroCard.current} amount={18420.62} currency="EUR" className="mb-4" />
                <Card className="mb-3 flex items-center justify-between p-3">
                  <span className="text-xs font-medium">{c.heroCard.savings}</span>
                  <span className="font-mono text-xs font-semibold tabular">9 280,00 €</span>
                </Card>
                <Card className="flex items-center justify-between p-3">
                  <span className="text-xs font-medium">{c.heroCard.fixed}</span>
                  <span className="font-mono text-xs font-semibold tabular">15 000,00 €</span>
                </Card>
              </div>
            </div>
            <div className="absolute -right-6 top-10 hidden rotate-6 rounded-2xl bg-card p-3 shadow-card sm:block">
              <p className="text-[10px] text-muted-foreground">{c.heroCard.transferSent}</p>
              <p className="text-xs font-semibold text-emerald-600">{c.heroCard.deliveredIn}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-semibold md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="container py-20">
        <div className="mb-10 max-w-lg">
          <h2 className="font-display text-3xl font-semibold tracking-tight">{c.productsTitle}</h2>
          <p className="mt-3 text-muted-foreground">{c.productsSubtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.products.map((p, i) => {
            const Icon = productIcons[i];
            return (
              <Link key={p.title} href={productHrefs[i]}>
                <Card className="group h-full p-5 transition-shadow hover:shadow-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-100 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    {c.learnMore} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card py-20">
        <div className="container">
          <div className="mb-10 max-w-lg">
            <h2 className="font-display text-3xl font-semibold tracking-tight">{c.howItWorksTitle}</h2>
            <p className="mt-3 text-muted-foreground">{c.howItWorksSubtitle}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {c.steps.map((s) => (
              <div key={s.title}>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Banco Aurora */}
      <section className="container py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">{c.whyTitle}</h2>
            <p className="mt-3 text-muted-foreground">{c.whyDesc}</p>
            <Button className="mt-6" variant="outline" asChild>
              <Link href="/about">{c.whyCta}</Link>
            </Button>
          </div>
          <ul className="space-y-3">
            {c.why.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Security */}
      <section className="bg-vault-gradient py-20 text-white">
        <div className="container grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck className="h-6 w-6 text-mint-400" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight">{c.securityTitle}</h2>
            <p className="mt-3 max-w-md text-white/70">{c.securityDesc}</p>
            <Button variant="gold" className="mt-6" asChild>
              <Link href="/security-centre">{c.securityCta}</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {c.securityFeatures.map((label, i) => {
              const Icon = securityIcons[i];
              return (
                <div key={label} className="glass rounded-2xl p-4">
                  <Icon className="h-5 w-5 text-mint-400" />
                  <p className="mt-3 text-sm font-medium">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">{c.testimonialsTitle}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {c.testimonials.map((item) => (
            <Card key={item.name} className="p-6">
              <p className="text-sm leading-relaxed text-foreground">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="border-t border-border bg-card py-20">
        <div className="container grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">{c.faqTitle}</h2>
            <p className="mt-3 text-muted-foreground">{c.faqSubtitle}</p>
            <Button variant="outline" className="mt-5" asChild>
              <Link href="/faqs">{c.faqCta}</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {c.faqs.map((f) => (
              <Card key={f.q} className="p-5">
                <p className="flex items-center gap-2 font-display text-sm font-semibold">
                  <Landmark className="h-4 w-4 text-emerald-600" /> {f.q}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <Card className="flex flex-col items-center gap-5 bg-vault-gradient p-12 text-center text-white">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{c.ctaTitle}</h2>
          <p className="max-w-md text-white/70">{c.ctaDesc}</p>
          <Button size="lg" variant="gold" asChild>
            <Link href="/register">{t.landing.ctaPrimary}</Link>
          </Button>
        </Card>
      </section>
    </>
  );
}
