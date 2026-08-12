"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CreditCard, ShieldAlert, Banknote, Megaphone, ArrowLeftRight } from "lucide-react";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/services/api";
import { cn, formatDate } from "@/lib/utils";
import type { NotificationItem } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";

const categoryIcon: Record<NotificationItem["category"], typeof Bell> = {
  transaction: ArrowLeftRight,
  security: ShieldAlert,
  promotion: Megaphone,
  loan: Banknote,
  card: CreditCard,
};

export default function NotificationsPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: notifications } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });

  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const readAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <div>
      <TopNav title={t.pages.notifications} back />
      <div className="px-5 py-4">
        <Button variant="outline" size="sm" className="mb-3" onClick={() => readAllMutation.mutate()}>
          Mark all as read
        </Button>

        {notifications?.length === 0 && (
          <EmptyState icon={Bell} title="You're all caught up" description="New notifications will show up here." />
        )}

        <div className="space-y-2">
          {notifications?.map((n) => {
            const Icon = categoryIcon[n.category];
            return (
              <Card
                key={n.id}
                className={cn("flex items-start gap-3 p-3.5", !n.read && "border-emerald/30 bg-mint-100/40")}
                onClick={() => readMutation.mutate(n.id)}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-100 text-emerald-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(n.date, true)}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald" />}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
