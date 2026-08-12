import { HelpCircle, ShieldCheck, Clock } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Frequently asked questions." };

const features = [
    { icon: HelpCircle, title: "Is my money protected?", description: "Eligible deposits are protected up to the applicable scheme limit in your region." },
    { icon: Clock, title: "How fast are transfers?", description: "Internal transfers are instant; local transfers typically settle same-day." },
    { icon: ShieldCheck, title: "Is Banco Aurora regulated?", description: "Banco Aurora operates under banking licences in each market it serves." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="FAQs"
      title="Frequently asked questions."
      description="Quick answers to the questions we hear most from new and existing customers."
      features={features}
    />
  );
}
