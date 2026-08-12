import { ShieldCheck, Fingerprint, Eye } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Your security, always visible." };

const features = [
    { icon: ShieldCheck, title: "Real-time monitoring", description: "Every transaction is screened against fraud signals as it happens." },
    { icon: Fingerprint, title: "Biometric sign-in", description: "Use Face ID or fingerprint instead of typing a password." },
    { icon: Eye, title: "Full visibility", description: "See every device signed in and every login attempt on your account." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Security Centre"
      title="Your security, always visible."
      description="Review login activity, manage devices, and control every layer of protection on your account from one place."
      features={features}
  closing={{ title: "Review your security settings.", description: "Takes two minutes, worth every second." }}
    />
  );
}
