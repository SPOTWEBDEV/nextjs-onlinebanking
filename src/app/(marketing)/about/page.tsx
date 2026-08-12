import { Users, Target, Rocket } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "A bank built by people tired of waiting on their bank." };

const features = [
    { icon: Users, title: "2.4M+ customers", description: "Individuals and businesses across 180+ countries trust Banco Aurora with their money." },
    { icon: Target, title: "Our mission", description: "Make managing money feel calm, clear, and instant — never a source of anxiety." },
    { icon: Rocket, title: "Founded 2019", description: "Launched as a mobile-first challenger bank, now a full digital banking platform." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="About Banco Aurora"
      title="A bank built by people tired of waiting on their bank."
      description="Banco Aurora was founded to make everyday banking feel as fast and considered as the rest of the apps on your phone. Today we serve millions of customers across personal, business, and corporate banking."
      features={features}
  closing={{ title: "Come build the future of banking with us.", description: "We're always looking for people who care about craft." }}
    />
  );
}
