import { Rocket, Users, Heart } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Help us build the bank we always wanted." };

const features = [
    { icon: Rocket, title: "Engineering", description: "Backend, mobile, and platform roles across our product teams." },
    { icon: Users, title: "Design & Research", description: "Shape the experience millions of customers use every day." },
    { icon: Heart, title: "Operations & Support", description: "Help customers directly and improve how we serve them." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Careers"
      title="Help us build the bank we always wanted."
      description="We're a remote-friendly team obsessed with craft, speed, and doing right by the people who trust us with their money."
      features={features}
  closing={{ title: "See open roles.", description: "New positions are posted every month." }}
    />
  );
}
