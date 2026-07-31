import { MessageCircle, Phone, Mail } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "We're here whenever you need us." };

const features = [
    { icon: MessageCircle, title: "Live chat", description: "Available 24/7 inside the app and on the web." },
    { icon: Phone, title: "Phone support", description: "Ligue para +351 210 500 100, todos os dias, 7h–23h." },
    { icon: Mail, title: "Email us", description: "support@aurorabank.example — replies within one business day." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Contact"
      title="We're here whenever you need us."
      description="Reach our support team by chat, phone, or email — most conversations start in under two minutes."
      features={features}
    />
  );
}
