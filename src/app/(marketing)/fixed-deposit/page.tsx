import { Lock, TrendingUp, Calendar } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Lock in your rate. Watch it grow." };

const features = [
    { icon: Lock, title: "Guaranteed rate", description: "Your rate is fixed the day you open the deposit and never changes." },
    { icon: TrendingUp, title: "Up to 6.2% APY", description: "Longer terms unlock our best rates, paid monthly or at maturity." },
    { icon: Calendar, title: "Flexible terms", description: "Choose 3, 6, 12, or 24-month terms to match your plans." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Fixed Deposit"
      title="Lock in your rate. Watch it grow."
      description="Guaranteed returns on terms from 3 to 24 months, with no market exposure and no surprises."
      features={features}
  closing={{ title: "Open a fixed deposit today.", description: "Guaranteed growth, zero market risk." }}
    />
  );
}
