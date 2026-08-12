"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Home, HelpCircle, Megaphone, Newspaper, Image as ImageIcon, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sections = [
  { id: "homepage", label: "Homepage", icon: Home },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "news", label: "News", icon: Newspaper },
  { id: "promotions", label: "Promotions", icon: Megaphone },
  { id: "banners", label: "Banners", icon: ImageIcon },
] as const;

const items: Record<string, { title: string; status: "published" | "draft" }[]> = {
  homepage: [
    { title: "Hero — Banking that feels effortless", status: "published" },
    { title: "Security callout section", status: "published" },
  ],
  faqs: [
    { title: "Is my money protected?", status: "published" },
    { title: "How fast are transfers?", status: "published" },
    { title: "New: crypto custody FAQ", status: "draft" },
  ],
  news: [
    { title: "Banco Aurora launches fixed deposits at 6.2%", status: "published" },
    { title: "Q2 platform update notes", status: "draft" },
  ],
  promotions: [
    { title: "Refer a friend, get $25", status: "published" },
    { title: "Summer savings boost", status: "draft" },
  ],
  banners: [
    { title: "App download banner", status: "published" },
    { title: "Black Friday card offer", status: "draft" },
  ],
};

export default function AdminCmsPage() {
  const [section, setSection] = useState<(typeof sections)[number]["id"]>("homepage");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Content Management</h1>
        <p className="text-sm text-muted-foreground">Manage homepage content, FAQs, news, promotions, and banners.</p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium",
              section === s.id ? "border-emerald bg-mint-100 text-emerald-600" : "border-border text-muted-foreground"
            )}
          >
            <s.icon className="h-3.5 w-3.5" /> {s.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="capitalize">{section}</CardTitle>
          <Button size="sm" onClick={() => toast.success("New item created")}>
            + New
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {items[section].map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-xl border border-border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <div className="flex items-center gap-2">
                <Badge variant={item.status === "published" ? "success" : "neutral"} className="capitalize">
                  {item.status}
                </Badge>
                <Button size="sm" variant="ghost" onClick={() => toast.info("Editor — demo")}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
