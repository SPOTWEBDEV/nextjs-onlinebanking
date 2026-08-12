"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, FileText, ShieldAlert, Upload } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMe, submitKycDocuments } from "@/lib/services/api";
import { useLanguage } from "@/lib/i18n/context";

const statusConfig = {
  verified: { icon: CheckCircle2, color: "text-emerald-600", badge: "success" as const, title: "You're verified" },
  pending: { icon: Clock3, color: "text-gold", badge: "warning" as const, title: "Under review" },
  unverified: { icon: ShieldAlert, color: "text-coral", badge: "danger" as const, title: "Not verified yet" },
};

const documents = [
  { id: "id", label: "Government-issued ID", icon: FileText },
  { id: "address", label: "Proof of address", icon: FileText },
  { id: "selfie", label: "Selfie verification", icon: FileText },
];

export default function KycPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const { data: me, isLoading } = useQuery({ queryKey: ["me"], queryFn: fetchMe });

  const submitMutation = useMutation({
    mutationFn: submitKycDocuments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Documents submitted — our team will review them shortly");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not submit documents"),
  });

  if (isLoading || !me) {
    return (
      <div>
        <TopNav title={t.pages.kyc} back />
        <div className="space-y-4 px-5 py-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const config = statusConfig[me.kycStatus];
  const allUploaded = documents.every((d) => uploaded[d.id]);

  return (
    <div>
      <TopNav title={t.pages.kyc} back />
      <div className="space-y-4 px-5 py-4">
        <Card className="flex flex-col items-center p-6 text-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-mint-100 ${config.color}`}>
            <config.icon className="h-7 w-7" />
          </div>
          <p className="mt-3 font-display text-lg font-semibold">{config.title}</p>
          <Badge variant={config.badge} className="mt-2 capitalize">
            {me.kycStatus}
          </Badge>
          {me.kycStatus === "pending" && (
            <p className="mt-3 text-sm text-muted-foreground">
              Your documents are with our review team. This usually takes 1–2 business days.
            </p>
          )}
          {me.kycStatus === "verified" && (
            <p className="mt-3 text-sm text-muted-foreground">
              Your identity has been verified. You have full access to every Banco Aurora feature.
            </p>
          )}
          {me.kycStatus === "unverified" && (
            <p className="mt-3 text-sm text-muted-foreground">
              Submit your documents below to unlock higher transfer limits and full account features.
            </p>
          )}
        </Card>

        {me.kycStatus === "unverified" && (
          <Card className="p-4">
            <p className="mb-3 text-sm font-semibold">Required documents</p>
            <div className="space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setUploaded((u) => ({ ...u, [doc.id]: true }));
                    toast.success(`${doc.label} uploaded (demo)`);
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left text-sm"
                >
                  <span className="flex items-center gap-2">
                    <doc.icon className="h-4 w-4 text-muted-foreground" />
                    {doc.label}
                  </span>
                  {uploaded[doc.id] ? (
                    <Badge variant="success">Uploaded</Badge>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </span>
                  )}
                </button>
              ))}
            </div>
            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={!allUploaded || submitMutation.isPending}
              onClick={() => submitMutation.mutate()}
            >
              Submit for review
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo tip: uploads are simulated — tap each row to mark it uploaded, no real files are sent.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
