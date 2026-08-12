import { CreditCard, Percent, ShieldCheck } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "A credit card that rewards how you actually spend." };

const features = [
    { icon: CreditCard, title: "Up to 3% cashback", description: "Earn on groceries, transport, and subscriptions automatically." },
    { icon: Percent, title: "No annual fee option", description: "A genuinely free tier alongside our premium metal card." },
    { icon: ShieldCheck, title: "Real-time controls", description: "Freeze your card, set limits, and get instant spend alerts." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Credit Cards"
      title="A credit card that rewards how you actually spend."
      description="Cashback on everyday categories, no annual fee tiers, and real-time spend controls."
      features={features}
  closing={{ title: "Apply for a Banco Aurora credit card.", description: "A decision in as little as 60 seconds." }}
    />
  );
}
