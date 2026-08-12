// One-off content scaffolding utility.
// Run with: node scripts/generate-marketing-pages.mjs
// Regenerating a page after editing its config here will overwrite it.
import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "src", "app", "(marketing)");

const pages = [
  {
    slug: "about",
    kicker: "About Banco Aurora",
    title: "A bank built by people tired of waiting on their bank.",
    description:
      "Banco Aurora was founded to make everyday banking feel as fast and considered as the rest of the apps on your phone. Today we serve millions of customers across personal, business, and corporate banking.",
    icons: ["Users", "Target", "Rocket"],
    features: [
      ["Users", "2.4M+ customers", "Individuals and businesses across 180+ countries trust Banco Aurora with their money."],
      ["Target", "Our mission", "Make managing money feel calm, clear, and instant — never a source of anxiety."],
      ["Rocket", "Founded 2019", "Launched as a mobile-first challenger bank, now a full digital banking platform."],
    ],
    closing: { title: "Come build the future of banking with us.", description: "We're always looking for people who care about craft." },
  },
  {
    slug: "personal-banking",
    kicker: "Personal Banking",
    title: "Everyday banking that keeps up with you.",
    description: "Spend, save, and track your money from one beautifully simple app — with no hidden fees and no branch visits.",
    icons: ["Wallet", "PiggyBank", "BarChart3"],
    features: [
      ["Wallet", "Fee-free current account", "No monthly fees, no minimum balance, and a virtual card the moment you sign up."],
      ["PiggyBank", "Goals-based savings", "Set a target, automate contributions, and watch your progress in real time."],
      ["BarChart3", "Spending insights", "Automatic categorisation shows exactly where your money goes each month."],
    ],
    stats: [["4.9/5", "App rating"], ["2 min", "Average sign-up time"], ["0", "Monthly account fees"], ["24/7", "Card controls"]],
    closing: { title: "Your everyday account, reimagined.", description: "Open a personal account in minutes." },
  },
  {
    slug: "business-banking",
    kicker: "Business Banking",
    title: "Business banking that moves at startup speed.",
    description: "Send payments, manage payroll, and issue employee cards — all with real-time visibility into your cash flow.",
    icons: ["Building2", "Users", "Receipt"],
    features: [
      ["Building2", "Multi-user accounts", "Add teammates with granular permissions for approvals and spend."],
      ["Users", "Employee cards", "Issue physical or virtual cards with per-card limits and instant freezing."],
      ["Receipt", "Automated bookkeeping", "Export categorised transactions straight to your accounting software."],
    ],
    closing: { title: "Banking that scales with your business.", description: "Open a business account in one sitting." },
  },
  {
    slug: "corporate-banking",
    kicker: "Corporate Banking",
    title: "Treasury and payments infrastructure for large organisations.",
    description: "Multi-entity accounts, bulk payments, and dedicated relationship support for corporates managing complex cash operations.",
    icons: ["Building2", "Landmark", "ShieldCheck"],
    features: [
      ["Building2", "Multi-entity structure", "Manage subsidiaries and cost centres from a single consolidated view."],
      ["Landmark", "Bulk & batch payments", "Upload payment files for payroll runs and supplier disbursements."],
      ["ShieldCheck", "Dedicated support", "A named relationship manager and priority-routed support line."],
    ],
    closing: { title: "Talk to our corporate banking team.", description: "We'll design an account structure around how you operate." },
  },
  {
    slug: "savings-accounts",
    kicker: "Savings",
    title: "Save on autopilot, earn more along the way.",
    description: "Flexible, fixed, and auto-save accounts with market-leading rates and goal tracking built in.",
    icons: ["PiggyBank", "TrendingUp", "Target"],
    features: [
      ["PiggyBank", "Flexible Savings", "Withdraw anytime while still earning a competitive variable rate."],
      ["TrendingUp", "Fixed Savings", "Lock in a guaranteed rate for 3, 6, or 12 months."],
      ["Target", "Savings Goals", "Create named goals with progress bars and automated round-ups."],
    ],
    stats: [["6.2%", "12-month fixed APY"], ["3.8%", "Flexible savings APY"], ["$0", "Minimum to open"], ["3", "Goal types"]],
    closing: { title: "Start a savings goal today.", description: "It takes less than a minute to set up." },
  },
  {
    slug: "current-accounts",
    kicker: "Current Accounts",
    title: "A current account built for real life.",
    description: "Instant notifications, fee-free spending abroad, and full control over your card from one screen.",
    icons: ["Wallet", "Globe", "Bell"],
    features: [
      ["Wallet", "No monthly fees", "A genuinely free current account, with no minimum balance requirements."],
      ["Globe", "Fee-free abroad", "Spend in 150+ currencies at the real exchange rate, wherever you are."],
      ["Bell", "Instant alerts", "Get notified the moment money moves in or out of your account."],
    ],
    closing: { title: "Switch to Banco Aurora in one afternoon.", description: "We'll help you move direct debits over too." },
  },
  {
    slug: "investment",
    kicker: "Investing",
    title: "Investing, without the intimidation.",
    description: "Build a diversified portfolio with fractional investing, low fees, and clear performance reporting.",
    icons: ["LineChart", "PieChart", "ShieldCheck"],
    features: [
      ["LineChart", "Fractional investing", "Start with as little as $10 across global index funds and bonds."],
      ["PieChart", "Managed portfolios", "Choose a risk profile and let auto-rebalancing do the rest."],
      ["ShieldCheck", "Transparent fees", "One simple annual fee — no hidden trading commissions."],
    ],
    closing: { title: "Start investing in minutes.", description: "Your first portfolio is one form away." },
  },
  {
    slug: "fixed-deposit",
    kicker: "Fixed Deposit",
    title: "Lock in your rate. Watch it grow.",
    description: "Guaranteed returns on terms from 3 to 24 months, with no market exposure and no surprises.",
    icons: ["Lock", "TrendingUp", "Calendar"],
    features: [
      ["Lock", "Guaranteed rate", "Your rate is fixed the day you open the deposit and never changes."],
      ["TrendingUp", "Up to 6.2% APY", "Longer terms unlock our best rates, paid monthly or at maturity."],
      ["Calendar", "Flexible terms", "Choose 3, 6, 12, or 24-month terms to match your plans."],
    ],
    closing: { title: "Open a fixed deposit today.", description: "Guaranteed growth, zero market risk." },
  },
  {
    slug: "loan-services",
    kicker: "Loans",
    title: "Straightforward loans, transparent terms.",
    description: "Personal, auto, and home improvement loans with a decision in minutes and no origination surprises.",
    icons: ["Banknote", "Calculator", "FileCheck"],
    features: [
      ["Banknote", "Personal Loans", "Borrow up to $25,000 at fixed monthly repayments."],
      ["Calculator", "Built-in EMI calculator", "See your exact monthly repayment before you apply."],
      ["FileCheck", "Fast decisions", "Most applications are decided in under 10 minutes."],
    ],
    closing: { title: "Check your loan rate.", description: "Checking your rate never affects your credit score." },
  },
  {
    slug: "mortgage",
    kicker: "Mortgages",
    title: "Mortgages without the paperwork headache.",
    description: "Competitive fixed and variable rates with a fully digital application and dedicated mortgage advisers.",
    icons: ["Home", "Percent", "FileCheck"],
    features: [
      ["Home", "First-time buyer support", "Guidance and calculators built for buyers new to the process."],
      ["Percent", "Competitive fixed rates", "Lock in your rate for 2, 5, or 10 years."],
      ["FileCheck", "Digital application", "Upload documents and track your application status in-app."],
    ],
    closing: { title: "Get a mortgage in-principle decision.", description: "Takes about 15 minutes, no obligation." },
  },
  {
    slug: "credit-cards",
    kicker: "Credit Cards",
    title: "A credit card that rewards how you actually spend.",
    description: "Cashback on everyday categories, no annual fee tiers, and real-time spend controls.",
    icons: ["CreditCard", "Percent", "ShieldCheck"],
    features: [
      ["CreditCard", "Up to 3% cashback", "Earn on groceries, transport, and subscriptions automatically."],
      ["Percent", "No annual fee option", "A genuinely free tier alongside our premium metal card."],
      ["ShieldCheck", "Real-time controls", "Freeze your card, set limits, and get instant spend alerts."],
    ],
    closing: { title: "Apply for a Banco Aurora credit card.", description: "A decision in as little as 60 seconds." },
  },
  {
    slug: "debit-cards",
    kicker: "Debit Cards",
    title: "A debit card built for how you actually pay.",
    description: "Physical and virtual cards issued instantly, with contactless, tap-to-pay, and full in-app controls.",
    icons: ["CreditCard", "Smartphone", "Lock"],
    features: [
      ["CreditCard", "Instant virtual card", "Get a spendable virtual card the second you open your account."],
      ["Smartphone", "Apple & Google Pay", "Add your card to your phone's wallet in a few taps."],
      ["Lock", "Freeze anytime", "Lost your card? Freeze and unfreeze it instantly from the app."],
    ],
    closing: { title: "Order your Banco Aurora debit card.", description: "Free physical card delivered in 3-5 business days." },
  },
  {
    slug: "contact",
    kicker: "Contact",
    title: "We're here whenever you need us.",
    description: "Reach our support team by chat, phone, or email — most conversations start in under two minutes.",
    icons: ["MessageCircle", "Phone", "Mail"],
    features: [
      ["MessageCircle", "Live chat", "Available 24/7 inside the app and on the web."],
      ["Phone", "Phone support", "Ligue para +351 210 500 100, todos os dias, 7h–23h."],
      ["Mail", "Email us", "support@aurorabank.example — replies within one business day."],
    ],
  },
  {
    slug: "help-centre",
    kicker: "Help Centre",
    title: "Answers, guides, and how-tos.",
    description: "Search our help centre for step-by-step guides on transfers, cards, security, and more.",
    icons: ["LifeBuoy", "BookOpen", "MessageCircle"],
    features: [
      ["LifeBuoy", "Getting started", "Everything you need for your first week with Banco Aurora."],
      ["BookOpen", "Guides & tutorials", "Deep dives into transfers, savings goals, and card controls."],
      ["MessageCircle", "Still stuck?", "Our support team is one tap away inside the app."],
    ],
  },
  {
    slug: "faqs",
    kicker: "FAQs",
    title: "Frequently asked questions.",
    description: "Quick answers to the questions we hear most from new and existing customers.",
    icons: ["HelpCircle", "ShieldCheck", "Clock"],
    features: [
      ["HelpCircle", "Is my money protected?", "Eligible deposits are protected up to the applicable scheme limit in your region."],
      ["Clock", "How fast are transfers?", "Internal transfers are instant; local transfers typically settle same-day."],
      ["ShieldCheck", "Is Banco Aurora regulated?", "Banco Aurora operates under banking licences in each market it serves."],
    ],
  },
  {
    slug: "careers",
    kicker: "Careers",
    title: "Help us build the bank we always wanted.",
    description: "We're a remote-friendly team obsessed with craft, speed, and doing right by the people who trust us with their money.",
    icons: ["Rocket", "Users", "Heart"],
    features: [
      ["Rocket", "Engineering", "Backend, mobile, and platform roles across our product teams."],
      ["Users", "Design & Research", "Shape the experience millions of customers use every day."],
      ["Heart", "Operations & Support", "Help customers directly and improve how we serve them."],
    ],
    closing: { title: "See open roles.", description: "New positions are posted every month." },
  },
  {
    slug: "privacy-policy",
    kicker: "Legal",
    title: "Privacy Policy",
    description:
      "This is placeholder demo copy. Banco Aurora is a fictional product built for demonstration purposes; no real personal data is collected, stored, or processed by this application.",
    icons: ["ShieldCheck", "Lock", "FileText"],
    features: [
      ["ShieldCheck", "Data we don't collect", "This demo uses mock data only — no real personal or financial information is stored."],
      ["Lock", "Encryption in transit", "In a production deployment, all traffic would be encrypted via TLS."],
      ["FileText", "Your rights", "A real policy would detail access, correction, and deletion rights here."],
    ],
  },
  {
    slug: "terms",
    kicker: "Legal",
    title: "Terms & Conditions",
    description:
      "This is placeholder demo copy. Banco Aurora is a fictional demo product and does not offer real banking, payment, or lending services.",
    icons: ["FileText", "Scale", "AlertTriangle"],
    features: [
      ["FileText", "Demo purposes only", "No real account opening, transfers, or financial agreements occur in this app."],
      ["Scale", "Governing terms", "A production deployment would state governing law and dispute resolution here."],
      ["AlertTriangle", "No warranty", "Provided as-is for demonstration; not a substitute for legal advice."],
    ],
  },
  {
    slug: "security-centre",
    kicker: "Security Centre",
    title: "Your security, always visible.",
    description: "Review login activity, manage devices, and control every layer of protection on your account from one place.",
    icons: ["ShieldCheck", "Fingerprint", "Eye"],
    features: [
      ["ShieldCheck", "Real-time monitoring", "Every transaction is screened against fraud signals as it happens."],
      ["Fingerprint", "Biometric sign-in", "Use Face ID or fingerprint instead of typing a password."],
      ["Eye", "Full visibility", "See every device signed in and every login attempt on your account."],
    ],
    closing: { title: "Review your security settings.", description: "Takes two minutes, worth every second." },
  },
];

const iconImport = (icons) => `import { ${[...new Set(icons)].join(", ")} } from "lucide-react";`;

for (const p of pages) {
  const allIcons = [...p.icons, ...p.features.map((f) => f[0])];
  const featuresCode = p.features
    .map(([icon, title, description]) => `    { icon: ${icon}, title: ${JSON.stringify(title)}, description: ${JSON.stringify(description)} },`)
    .join("\n");
  const statsCode = p.stats
    ? `\n  stats={[\n${p.stats.map(([value, label]) => `    { value: ${JSON.stringify(value)}, label: ${JSON.stringify(label)} },`).join("\n")}\n  ]}`
    : "";
  const closingCode = p.closing
    ? `\n  closing={{ title: ${JSON.stringify(p.closing.title)}, description: ${JSON.stringify(p.closing.description)} }}`
    : "";

  const source = `${iconImport(allIcons)}
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: ${JSON.stringify(p.title)} };

const features = [
${featuresCode}
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker=${JSON.stringify(p.kicker)}
      title=${JSON.stringify(p.title)}
      description=${JSON.stringify(p.description)}
      features={features}${statsCode}${closingCode}
    />
  );
}
`;

  const dir = path.join(outDir, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), source);
  console.log("wrote", p.slug);
}
