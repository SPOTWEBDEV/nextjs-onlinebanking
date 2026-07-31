"use client";

import { useState } from "react";
import { Bot, LifeBuoy, Loader2, Send, Ticket } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ChatMessage = { from: "user" | "agent"; text: string };

const initialMessages: ChatMessage[] = [
  { from: "agent", text: "Hi Mariana 👋 I'm Nova, your Banco Aurora assistant. How can I help today?" },
];

export default function SupportPage() {
  const [tab, setTab] = useState<"chat" | "ticket">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: "user", text: input }]);
    setInput("");
    setSending(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "agent", text: "Thanks for the details — this is a demo assistant, a real agent would follow up shortly." },
      ]);
      setSending(false);
    }, 900);
  };

  return (
    <div>
      <TopNav title="Support" back />

      <div className="px-5 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("chat")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-medium",
              tab === "chat" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <Bot className="h-4 w-4" /> Live chat
          </button>
          <button
            onClick={() => setTab("ticket")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-medium",
              tab === "ticket" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <Ticket className="h-4 w-4" /> Submit a ticket
          </button>
        </div>
      </div>

      {tab === "chat" ? (
        <div className="flex flex-col px-5 pb-4">
          <Card className="flex h-[420px] flex-col p-3">
            <div className="flex-1 space-y-2 overflow-y-auto p-1">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                      m.from === "user" ? "bg-emerald text-white" : "bg-muted"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Nova is typing…
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Input
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <Button size="icon" onClick={send} aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 px-5 pb-4">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <LifeBuoy className="h-4 w-4 text-emerald-600" /> New support ticket
            </div>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Ticket #MB-4821 submitted — we'll reply within 24 hours");
              }}
            >
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g. Transfer not received" required />
              </div>
              <div>
                <Label htmlFor="details">Details</Label>
                <textarea
                  id="details"
                  rows={4}
                  required
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                  placeholder="Tell us what happened…"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Submit ticket
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
