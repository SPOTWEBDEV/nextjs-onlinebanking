import { CreditCard, Smartphone, Lock } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "A debit card built for how you actually pay." };

const features = [
    { icon: CreditCard, title: "Instant virtual card", description: "Get a spendable virtual card the second you open your account." },
    { icon: Smartphone, title: "Apple & Google Pay", description: "Add your card to your phone's wallet in a few taps." },
    { icon: Lock, title: "Freeze anytime", description: "Lost your card? Freeze and unfreeze it instantly from the app." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Debit Cards"
      title="A debit card built for how you actually pay."
      description="Physical and virtual cards issued instantly, with contactless, tap-to-pay, and full in-app controls."
      features={features}
  closing={{ title: "Order your Banco Aurora debit card.", description: "Free physical card delivered in 3-5 business days." }}
    />
  );
}
