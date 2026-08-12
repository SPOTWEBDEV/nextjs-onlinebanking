import { LineChart, PieChart, ShieldCheck } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Investing, without the intimidation." };

const features = [
    { icon: LineChart, title: "Fractional investing", description: "Start with as little as $10 across global index funds and bonds." },
    { icon: PieChart, title: "Managed portfolios", description: "Choose a risk profile and let auto-rebalancing do the rest." },
    { icon: ShieldCheck, title: "Transparent fees", description: "One simple annual fee — no hidden trading commissions." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Investing"
      title="Investing, without the intimidation."
      description="Build a diversified portfolio with fractional investing, low fees, and clear performance reporting."
      features={features}
  closing={{ title: "Start investing in minutes.", description: "Your first portfolio is one form away." }}
    />
  );
}
