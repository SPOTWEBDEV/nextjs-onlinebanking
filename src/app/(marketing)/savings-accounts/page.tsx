import { PiggyBank, TrendingUp, Target } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Save on autopilot, earn more along the way." };

const features = [
    { icon: PiggyBank, title: "Flexible Savings", description: "Withdraw anytime while still earning a competitive variable rate." },
    { icon: TrendingUp, title: "Fixed Savings", description: "Lock in a guaranteed rate for 3, 6, or 12 months." },
    { icon: Target, title: "Savings Goals", description: "Create named goals with progress bars and automated round-ups." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Savings"
      title="Save on autopilot, earn more along the way."
      description="Flexible, fixed, and auto-save accounts with market-leading rates and goal tracking built in."
      features={features}
  stats={[
    { value: "6.2%", label: "12-month fixed APY" },
    { value: "3.8%", label: "Flexible savings APY" },
    { value: "$0", label: "Minimum to open" },
    { value: "3", label: "Goal types" },
  ]}
  closing={{ title: "Start a savings goal today.", description: "It takes less than a minute to set up." }}
    />
  );
}
