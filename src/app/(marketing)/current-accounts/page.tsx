import { Wallet, Globe, Bell } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "A current account built for real life." };

const features = [
    { icon: Wallet, title: "No monthly fees", description: "A genuinely free current account, with no minimum balance requirements." },
    { icon: Globe, title: "Fee-free abroad", description: "Spend in 150+ currencies at the real exchange rate, wherever you are." },
    { icon: Bell, title: "Instant alerts", description: "Get notified the moment money moves in or out of your account." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Current Accounts"
      title="A current account built for real life."
      description="Instant notifications, fee-free spending abroad, and full control over your card from one screen."
      features={features}
  closing={{ title: "Switch to Banco Aurora in one afternoon.", description: "We'll help you move direct debits over too." }}
    />
  );
}
