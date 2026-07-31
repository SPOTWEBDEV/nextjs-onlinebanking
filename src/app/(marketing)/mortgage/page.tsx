import { Home, Percent, FileCheck } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Mortgages without the paperwork headache." };

const features = [
    { icon: Home, title: "First-time buyer support", description: "Guidance and calculators built for buyers new to the process." },
    { icon: Percent, title: "Competitive fixed rates", description: "Lock in your rate for 2, 5, or 10 years." },
    { icon: FileCheck, title: "Digital application", description: "Upload documents and track your application status in-app." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Mortgages"
      title="Mortgages without the paperwork headache."
      description="Competitive fixed and variable rates with a fully digital application and dedicated mortgage advisers."
      features={features}
  closing={{ title: "Get a mortgage in-principle decision.", description: "Takes about 15 minutes, no obligation." }}
    />
  );
}
