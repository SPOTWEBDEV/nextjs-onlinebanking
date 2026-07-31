import Link from "next/link";

const columns = [
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
];

export function MarketingFooter() {
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
        <p>© 2026 Banco Aurora. Demo product — mock data only, not a real financial institution.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
