"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const channels = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "push", label: "Push Notification", icon: Smartphone },
  { id: "inapp", label: "In-App", icon: Bell },
] as const;

export default function AdminNotificationsPage() {
  const [channel, setChannel] = useState<(typeof channels)[number]["id"]>("email");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Notification Management</h1>
        <p className="text-sm text-muted-foreground">Send targeted notifications across every channel.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose broadcast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {channels.map((c) => (
              <button
                key={c.id}
                onClick={() => setChannel(c.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-xs font-medium",
                  channel === c.id ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
                )}
              >
                <c.icon className="h-4 w-4" />
                {c.label}
              </button>
            ))}
          </div>

          <div>
            <Label htmlFor="segment">Audience segment</Label>
            <select id="segment" className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm">
              <option>All customers</option>
              <option>Premium tier</option>
              <option>Business accounts</option>
              <option>Inactive last 30 days</option>
            </select>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. New savings rate available" />
          </div>
          <div>
            <Label htmlFor="body">Message</Label>
            <textarea
              id="body"
              rows={4}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
              placeholder="Write your message…"
            />
          </div>
          <Button onClick={() => toast.success(`Broadcast queued via ${channel}`)}>Send broadcast</Button>
        </CardContent>
      </Card>
    </div>
  );
}
