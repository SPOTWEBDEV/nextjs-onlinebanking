"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

const columnsByLang = {
  pt: [
    {
      title: "Banca",
      links: [
        { href: "/personal-banking", label: "Contas Particulares" },
        { href: "/business-banking", label: "Contas Empresa" },
        { href: "/corporate-banking", label: "Banca Corporativa" },
        { href: "/savings-accounts", label: "Contas Poupança" },
        { href: "/current-accounts", label: "Contas à Ordem" },
      ],
    },
    {
      title: "Produtos",
      links: [
        { href: "/credit-cards", label: "Cartões de Crédito" },
        { href: "/debit-cards", label: "Cartões de Débito" },
        { href: "/loan-services", label: "Crédito" },
        { href: "/mortgage", label: "Crédito Habitação" },
        { href: "/investment", label: "Investimento" },
        { href: "/fixed-deposit", label: "Depósito a Prazo" },
      ],
    },
    {
      title: "Apoio",
      links: [
        { href: "/help-centre", label: "Centro de Ajuda" },
        { href: "/faqs", label: "Perguntas Frequentes" },
        { href: "/contact", label: "Contacto" },
        { href: "/security-centre", label: "Central de Segurança" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { href: "/about", label: "Sobre Nós" },
        { href: "/careers", label: "Carreiras" },
        { href: "/privacy-policy", label: "Política de Privacidade" },
        { href: "/terms", label: "Termos e Condições" },
      ],
    },
  ],
  en: [
    {
      title: "Banking",
      links: [
        { href: "/personal-banking", label: "Personal Banking" },
        { href: "/business-banking", label: "Business Banking" },
        { href: "/corporate-banking", label: "Corporate Banking" },
        { href: "/savings-accounts", label: "Savings Accounts" },
        { href: "/current-accounts", label: "Current Accounts" },
      ],
    },
    {
      title: "Products",
      links: [
        { href: "/credit-cards", label: "Credit Cards" },
        { href: "/debit-cards", label: "Debit Cards" },
        { href: "/loan-services", label: "Loans" },
        { href: "/mortgage", label: "Mortgage" },
        { href: "/investment", label: "Investment" },
        { href: "/fixed-deposit", label: "Fixed Deposit" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/help-centre", label: "Help Centre" },
        { href: "/faqs", label: "FAQs" },
        { href: "/contact", label: "Contact" },
        { href: "/security-centre", label: "Security Centre" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
      ],
    },
  ],
};

const footerCopyByLang = {
  pt: {
    rights: "© 2026 Banco Aurora. Produto de demonstração — sem serviços bancários reais.",
    privacy: "Privacidade",
    terms: "Termos",
  },
  en: {
    rights: "© 2026 Banco Aurora. Demo product — no real banking services.",
    privacy: "Privacy",
    terms: "Terms",
  },
};

export function MarketingFooter() {
  const { lang } = useLanguage();
  const columns = columnsByLang[lang];
  const copy = footerCopyByLang[lang];

  return (
    <footer className="border-t border-border bg-card">
      <div className="container grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-display text-sm font-semibold">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container flex flex-col items-start justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground md:flex-row md:items-center">
        <p>{copy.rights}</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-foreground">{copy.privacy}</Link>
          <Link href="/terms" className="hover:text-foreground">{copy.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
