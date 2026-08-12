import { Banknote, Calculator, FileCheck } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Straightforward loans, transparent terms." };

const features = [
    { icon: Banknote, title: "Personal Loans", description: "Borrow up to $25,000 at fixed monthly repayments." },
    { icon: Calculator, title: "Built-in EMI calculator", description: "See your exact monthly repayment before you apply." },
    { icon: FileCheck, title: "Fast decisions", description: "Most applications are decided in under 10 minutes." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Loans"
      title="Straightforward loans, transparent terms."
      description="Personal, auto, and home improvement loans with a decision in minutes and no origination surprises."
      features={features}
  closing={{ title: "Check your loan rate.", description: "Checking your rate never affects your credit score." }}
    />
  );
}
