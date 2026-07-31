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

const products = [
  { href: "/personal-banking", title: "Contas Particulares", desc: "Gastos do dia a dia, poupanças e objetivos numa só app.", icon: Smartphone },
  { href: "/business-banking", title: "Contas Empresa", desc: "Faça a gestão de salários, faturação e tesouraria com facilidade.", icon: Building2 },
  { href: "/investment", title: "Investir", desc: "Construa uma carteira com investimento fracionado e comissões baixas.", icon: LineChart },
  { href: "/savings-accounts", title: "Poupança", desc: "Objetivos, poupança automática e depósitos a prazo com boa taxa.", icon: PiggyBank },
];

const steps = [
  {
    title: "1. Abra a sua conta em minutos",
    desc: "Preencha os seus dados, valide a identidade com um documento e uma selfie, e comece a usar de imediato — sem ir a uma agência.",
  },
  {
    title: "2. Ligue o Multibanco e o cartão virtual",
    desc: "Receba um cartão virtual instantâneo e peça o cartão físico gratuito, entregue em casa em 3 a 5 dias úteis.",
  },
  {
    title: "3. Faça o seu dinheiro render",
    desc: "Crie objetivos de poupança, invista a partir de poucos euros, e acompanhe tudo com alertas em tempo real.",
  },
];

const why = [
  "Sem comissões de manutenção de conta",
  "Transferências SEPA instantâneas 24/7",
  "Cartão virtual disponível no momento da abertura de conta",
  "Apoio ao cliente por chat, telefone e email",
  "Aplicação disponível em Português e Inglês",
  "Autenticação biométrica e PIN de transferência em cada movimento",
];

const stats = [
  { value: "2,4M+", label: "Clientes em Portugal e na Europa" },
  { value: "180+", label: "Países suportados" },
  { value: "99,98%", label: "Disponibilidade da plataforma" },
  { value: "4,9/5", label: "Avaliação nas lojas de aplicações" },
];

const testimonials = [
  { name: "Mariana C.", role: "Designer freelancer", quote: "Mudar para o Banco Aurora demorou vinte minutos e desde então nunca mais deixei de olhar para a app — e isso é bom sinal." },
  { name: "Tiago A.", role: "Empresário", quote: "As confirmações instantâneas de transferência e os limites por cartão virtual mudaram a forma como pagamos a fornecedores." },
  { name: "Inês P.", role: "Gestora de produto", quote: "É genuinamente a app bancária mais rápida e mais calma que já usei, tanto no telemóvel como no computador." },
];

const faqs = [
  { q: "O meu dinheiro está protegido?", a: "Os depósitos elegíveis estão protegidos até ao limite aplicável do Fundo de Garantia de Depósitos em Portugal." },
  { q: "Quanto tempo demora uma transferência?", a: "Transferências internas são instantâneas; transferências SEPA chegam normalmente no mesmo dia útil." },
  { q: "O Banco Aurora é regulado?", a: "Este é um produto de demonstração — não presta serviços bancários reais nem está registado como instituição de crédito." },
];

export default function LandingPage() {
  const { t } = useLanguage();

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
                <VaultCard label="Conta Corrente" amount={18420.62} currency="EUR" className="mb-4" />
                <Card className="mb-3 flex items-center justify-between p-3">
                  <span className="text-xs font-medium">Poupança Reserva</span>
                  <span className="font-mono text-xs font-semibold tabular">9 280,00 €</span>
                </Card>
                <Card className="flex items-center justify-between p-3">
                  <span className="text-xs font-medium">Depósito a Prazo 12M</span>
                  <span className="font-mono text-xs font-semibold tabular">15 000,00 €</span>
                </Card>
              </div>
            </div>
            <div className="absolute -right-6 top-10 hidden rotate-6 rounded-2xl bg-card p-3 shadow-card sm:block">
              <p className="text-[10px] text-muted-foreground">Transferência enviada</p>
              <p className="text-xs font-semibold text-emerald-600">+ Entregue em 4s</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {stats.map((s) => (
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
          <h2 className="font-display text-3xl font-semibold tracking-tight">Uma app, todas as contas de que precisa.</h2>
          <p className="mt-3 text-muted-foreground">Desde o seu primeiro objetivo de poupança até gerir um negócio em crescimento, o Banco Aurora acompanha-o.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p.href} href={p.href}>
              <Card className="group h-full p-5 transition-shadow hover:shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-100 text-emerald-600">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  Saber mais <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card py-20">
        <div className="container">
          <div className="mb-10 max-w-lg">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Como funciona</h2>
            <p className="mt-3 text-muted-foreground">Do registo à primeira transferência em menos de dez minutos.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
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
            <h2 className="font-display text-3xl font-semibold tracking-tight">Porquê o Banco Aurora?</h2>
            <p className="mt-3 text-muted-foreground">
              Construímos o Banco Aurora para quem está cansado de esperar pelo seu banco tradicional —
              sem filas, sem burocracia, com total transparência sobre comissões e taxas.
            </p>
            <Button className="mt-6" variant="outline" asChild>
              <Link href="/about">Conhecer a nossa história</Link>
            </Button>
          </div>
          <ul className="space-y-3">
            {why.map((item) => (
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
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight">Segurança em cada camada.</h2>
            <p className="mt-3 max-w-md text-white/70">
              Autenticação biométrica, PIN de transferência, monitorização de fraude em
              tempo real, e controlo total sobre os seus cartões — tudo a partir da
              Central de Segurança.
            </p>
            <Button variant="gold" className="mt-6" asChild>
              <Link href="/security-centre">Visitar a Central de Segurança</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Zap, label: "Alertas de fraude em tempo real" },
              { icon: Fingerprint, label: "Autenticação biométrica" },
              { icon: Bell, label: "Notificações instantâneas" },
              { icon: CreditCard, label: "Cartões com limites ajustáveis" },
            ].map((f) => (
              <div key={f.label} className="glass rounded-2xl p-4">
                <f.icon className="h-5 w-5 text-mint-400" />
                <p className="mt-3 text-sm font-medium">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Amado por quem detesta esperar pelo banco.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6">
              <p className="text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="border-t border-border bg-card py-20">
        <div className="container grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">Perguntas frequentes</h2>
            <p className="mt-3 text-muted-foreground">Não encontrou o que procurava?</p>
            <Button variant="outline" className="mt-5" asChild>
              <Link href="/faqs">Ver todas as perguntas</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
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
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Pronto para um banco ao ritmo da sua vida?</h2>
          <p className="max-w-md text-white/70">Abra uma conta em minutos. Sem papelada, sem idas à agência, sem esperas.</p>
          <Button size="lg" variant="gold" asChild>
            <Link href="/register">{t.landing.ctaPrimary}</Link>
          </Button>
        </Card>
      </section>
    </>
  );
}
