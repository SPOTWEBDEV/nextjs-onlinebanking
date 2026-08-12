import { Building2, Landmark, ShieldCheck } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Treasury and payments infrastructure for large organisations." };

const features = [
    { icon: Building2, title: "Multi-entity structure", description: "Manage subsidiaries and cost centres from a single consolidated view." },
    { icon: Landmark, title: "Bulk & batch payments", description: "Upload payment files for payroll runs and supplier disbursements." },
    { icon: ShieldCheck, title: "Dedicated support", description: "A named relationship manager and priority-routed support line." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Corporate Banking"
      title="Treasury and payments infrastructure for large organisations."
      description="Multi-entity accounts, bulk payments, and dedicated relationship support for corporates managing complex cash operations."
      features={features}
  closing={{ title: "Talk to our corporate banking team.", description: "We'll design an account structure around how you operate." }}
    />
  );
}
