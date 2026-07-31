import { FileText, Scale, AlertTriangle } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Terms & Conditions" };

const features = [
    { icon: FileText, title: "Demo purposes only", description: "No real account opening, transfers, or financial agreements occur in this app." },
    { icon: Scale, title: "Governing terms", description: "A production deployment would state governing law and dispute resolution here." },
    { icon: AlertTriangle, title: "No warranty", description: "Provided as-is for demonstration; not a substitute for legal advice." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Legal"
      title="Terms & Conditions"
      description="This is placeholder demo copy. Banco Aurora is a fictional demo product and does not offer real banking, payment, or lending services."
      features={features}
    />
  );
}
