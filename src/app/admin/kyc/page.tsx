"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileText, User, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const initialQueue = [
  { id: "kyc_1", name: "Priya Natarajan", doc: "Government ID + Selfie", submitted: "2026-07-27" },
  { id: "kyc_2", name: "Grace Muthoni", doc: "Proof of Address", submitted: "2026-07-25" },
  { id: "kyc_3", name: "Samuel Okoye", doc: "Government ID + Selfie", submitted: "2026-07-24" },
];

export default function AdminKycPage() {
  const [queue, setQueue] = useState(initialQueue);

  const resolve = (id: string, action: "approve" | "reject") => {
    setQueue((q) => q.filter((item) => item.id !== id));
    toast[action === "approve" ? "success" : "error"](action === "approve" ? "KYC approved" : "KYC rejected");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">KYC Verification</h1>
        <p className="text-sm text-muted-foreground">Review identity documents, selfies, and proof of address.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending review ({queue.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {queue.length === 0 && <p className="text-sm text-muted-foreground">Queue is clear — nice work.</p>}
          {queue.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-100 text-emerald-600">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" /> {item.doc} · Submitted {item.submitted}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="warning">Pending</Badge>
                <Button size="sm" onClick={() => resolve(item.id, "approve")}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => resolve(item.id, "reject")}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
