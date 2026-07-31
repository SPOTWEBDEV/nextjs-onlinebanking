import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface MarketingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface MarketingStat {
  value: string;
  label: string;
}

export function MarketingPageTemplate({
  kicker,
  title,
  description,
  ctaLabel = "Open a free account",
  ctaHref = "/register",
  secondaryLabel,
  secondaryHref,
  features,
  stats,
  closing,
}: {
  kicker?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  features?: MarketingFeature[];
  stats?: MarketingStat[];
  closing?: { title: string; description: string };
}) {
  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="container py-16 md:py-20">
          <div className="max-w-2xl">
            {kicker && (
              <span className="inline-flex items-center rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                {kicker}
              </span>
            )}
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={ctaHref}>
                  {ctaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {secondaryLabel && secondaryHref && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {stats && stats.length > 0 && (
        <section className="border-b border-border">
          <div className="container grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-semibold md:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {features && features.length > 0 && (
        <section className="container py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-100 text-emerald-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {closing && (
        <section className="container pb-20">
          <Card className="flex flex-col items-center gap-5 bg-vault-gradient p-12 text-center text-white">
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{closing.title}</h2>
            <p className="max-w-md text-white/70">{closing.description}</p>
            <Button size="lg" variant="gold" asChild>
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </Card>
        </section>
      )}
    </>
  );
}
