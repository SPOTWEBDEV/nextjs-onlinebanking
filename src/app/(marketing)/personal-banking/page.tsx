import { Wallet, PiggyBank, BarChart3 } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Everyday banking that keeps up with you." };

const features = [
    { icon: Wallet, title: "Fee-free current account", description: "No monthly fees, no minimum balance, and a virtual card the moment you sign up." },
    { icon: PiggyBank, title: "Goals-based savings", description: "Set a target, automate contributions, and watch your progress in real time." },
    { icon: BarChart3, title: "Spending insights", description: "Automatic categorisation shows exactly where your money goes each month." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Personal Banking"
      title="Everyday banking that keeps up with you."
      description="Spend, save, and track your money from one beautifully simple app — with no hidden fees and no branch visits."
      features={features}
  stats={[
    { value: "4.9/5", label: "App rating" },
    { value: "2 min", label: "Average sign-up time" },
    { value: "0", label: "Monthly account fees" },
    { value: "24/7", label: "Card controls" },
  ]}
  closing={{ title: "Your everyday account, reimagined.", description: "Open a personal account in minutes." }}
    />
  );
}
