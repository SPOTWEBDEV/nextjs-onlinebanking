import { ShieldCheck, Lock, FileText } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Privacy Policy" };

const features = [
    { icon: ShieldCheck, title: "Data we don't collect", description: "This demo uses mock data only — no real personal or financial information is stored." },
    { icon: Lock, title: "Encryption in transit", description: "In a production deployment, all traffic would be encrypted via TLS." },
    { icon: FileText, title: "Your rights", description: "A real policy would detail access, correction, and deletion rights here." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Legal"
      title="Privacy Policy"
      description="This is placeholder demo copy. Banco Aurora is a fictional product built for demonstration purposes; no real personal data is collected, stored, or processed by this application."
      features={features}
    />
  );
}
