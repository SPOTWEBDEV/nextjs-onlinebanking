import { Building2, Users, Receipt } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Business banking that moves at startup speed." };

const features = [
    { icon: Building2, title: "Multi-user accounts", description: "Add teammates with granular permissions for approvals and spend." },
    { icon: Users, title: "Employee cards", description: "Issue physical or virtual cards with per-card limits and instant freezing." },
    { icon: Receipt, title: "Automated bookkeeping", description: "Export categorised transactions straight to your accounting software." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Business Banking"
      title="Business banking that moves at startup speed."
      description="Send payments, manage payroll, and issue employee cards — all with real-time visibility into your cash flow."
      features={features}
  closing={{ title: "Banking that scales with your business.", description: "Open a business account in one sitting." }}
    />
  );
}
