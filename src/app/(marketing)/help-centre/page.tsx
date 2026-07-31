import { LifeBuoy, BookOpen, MessageCircle } from "lucide-react";
import { MarketingPageTemplate } from "@/components/marketing/page-template";

export const metadata = { title: "Answers, guides, and how-tos." };

const features = [
    { icon: LifeBuoy, title: "Getting started", description: "Everything you need for your first week with Banco Aurora." },
    { icon: BookOpen, title: "Guides & tutorials", description: "Deep dives into transfers, savings goals, and card controls." },
    { icon: MessageCircle, title: "Still stuck?", description: "Our support team is one tap away inside the app." },
];

export default function Page() {
  return (
    <MarketingPageTemplate
      kicker="Help Centre"
      title="Answers, guides, and how-tos."
      description="Search our help centre for step-by-step guides on transfers, cards, security, and more."
      features={features}
    />
  );
}
