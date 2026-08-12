"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bitcoin, Check, CreditCard, Copy, Gift, Landmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchAccounts, fetchPaymentAccounts, createDeposit, resolveTransaction } from "@/lib/services/api";
import { cn, formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { showLocalNotification } from "@/lib/push";

const CRYPTO_OPTIONS = [
  { id: "BTC", label: "Bitcoin (BTC)" },
  { id: "ETH", label: "Ethereum (ETH)" },
  { id: "USDT", label: "Tether (USDT)" },
] as const;

const GIFT_CARD_PROVIDERS = ["Amazon", "Google Play", "Steam", "Banco Aurora Voucher"];
const GIFT_CARD_VALUES = [25, 50, 100, 200];

export default function DepositPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"card" | "crypto" | "giftcard" | "manual">("card");

  const { data: accounts } = useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });
  const primaryAccount = accounts?.[0];

  const { data: paymentAccounts, isLoading: loadingPaymentAccounts } = useQuery({
    queryKey: ["payment-accounts"],
    queryFn: fetchPaymentAccounts,
  });

  // Crypto state
  const [cryptoCurrency, setCryptoCurrency] = useState<(typeof CRYPTO_OPTIONS)[number]["id"]>("BTC");
  const [cryptoAmount, setCryptoAmount] = useState("100");
  const [pendingDeposit, setPendingDeposit] = useState<{ id: string; walletAddress: string; amount: number } | null>(null);

  // Gift card state
  const [giftProvider, setGiftProvider] = useState(GIFT_CARD_PROVIDERS[0]);
  const [giftValue, setGiftValue] = useState(GIFT_CARD_VALUES[0]);
  const [giftCode, setGiftCode] = useState("");

  // Card (Paystack-style, automatic) state
  const [cardNumber, setCardNumber] = useState("");
  const [cardAmount, setCardAmount] = useState("100");

  // Manual bank transfer state
  const [selectedPaymentAccountId, setSelectedPaymentAccountId] = useState("");
  const [manualAmount, setManualAmount] = useState("100");
  const [manualReference, setManualReference] = useState("");
  const [manualSubmitted, setManualSubmitted] = useState(false);

  const cryptoMutation = useMutation({
    mutationFn: () =>
      createDeposit({
        accountId: primaryAccount!.id,
        method: "crypto",
        amount: Number(cryptoAmount),
        cryptoCurrency,
      }),
    onSuccess: (data) => {
      setPendingDeposit({ id: data.id, walletAddress: data.walletAddress!, amount: data.amount });
      toast.success("Deposit request created — send the funds to the address shown");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not start deposit"),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => resolveTransaction(id, "approve"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Deposit confirmed — funds added to your account");
      showLocalNotification("Deposit confirmed", `${formatCurrency(pendingDeposit?.amount ?? 0)} added to your account`);
      setPendingDeposit(null);
      setCryptoAmount("100");
    },
  });

  const giftCardMutation = useMutation({
    mutationFn: () =>
      createDeposit({
        accountId: primaryAccount!.id,
        method: "giftcard",
        amount: giftValue,
        giftCardProvider: giftProvider,
        giftCardCode: giftCode,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(`${formatCurrency(giftValue)} added to your account`);
      showLocalNotification("Gift card redeemed", `${formatCurrency(giftValue)} added to your account`);
      setGiftCode("");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not redeem gift card"),
  });

  const cardMutation = useMutation({
    mutationFn: () =>
      createDeposit({
        accountId: primaryAccount!.id,
        method: "card",
        amount: Number(cardAmount),
        cardLast4: cardNumber.replace(/\s/g, "").slice(-4),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(`${formatCurrency(Number(cardAmount))} added instantly to your account`);
      showLocalNotification("Card deposit successful", `${formatCurrency(Number(cardAmount))} added instantly`);
      setCardNumber("");
      setCardAmount("100");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not process card payment"),
  });

  const manualMutation = useMutation({
    mutationFn: () =>
      createDeposit({
        accountId: primaryAccount!.id,
        method: "manual",
        amount: Number(manualAmount),
        paymentAccountId: selectedPaymentAccountId,
        reference: manualReference,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setManualSubmitted(true);
      toast.success("Deposit submitted — an admin will review and confirm it");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not submit deposit"),
  });

  return (
    <div>
      <TopNav title={t.pages.deposit} back />

      <div className="px-5 py-4">
        <div className="mb-5 flex gap-2">
          <button
            onClick={() => setTab("card")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium",
              tab === "card" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <CreditCard className="h-4 w-4" /> Card
          </button>
          <button
            onClick={() => setTab("crypto")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium",
              tab === "crypto" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <Bitcoin className="h-4 w-4" /> Crypto
          </button>
          <button
            onClick={() => setTab("giftcard")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium",
              tab === "giftcard" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <Gift className="h-4 w-4" /> Gift Card
          </button>
          <button
            onClick={() => setTab("manual")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium",
              tab === "manual" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <Landmark className="h-4 w-4" /> Bank Transfer
          </button>
        </div>

        {tab === "card" && (
          <Card className="p-4">
            <Badge variant="success" className="mb-3">Instant · auto-confirmed</Badge>
            <Label htmlFor="card-number">Card number</Label>
            <Input
              id="card-number"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="card-expiry">Expiry</Label>
                <Input id="card-expiry" placeholder="MM/YY" />
              </div>
              <div>
                <Label htmlFor="card-cvv">CVV</Label>
                <Input id="card-cvv" placeholder="123" maxLength={4} />
              </div>
            </div>

            <Label htmlFor="card-amount" className="mt-4">
              Amount to deposit ({primaryAccount?.currency ?? "EUR"})
            </Label>
            <Input id="card-amount" type="number" step="0.01" value={cardAmount} onChange={(e) => setCardAmount(e.target.value)} />

            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={cardMutation.isPending || !primaryAccount || cardNumber.replace(/\s/g, "").length < 4}
              onClick={() => cardMutation.mutate()}
            >
              {cardMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Deposit {formatCurrency(Number(cardAmount) || 0, primaryAccount?.currency)}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Processed like a Paystack card charge — settles instantly, no
              admin approval needed. Demo only: no real card network is
              contacted, no real charge occurs.
            </p>
          </Card>
        )}

        {tab === "crypto" && (
          <Card className="p-4">
            {!pendingDeposit ? (
              <>
                <Label>Cryptocurrency</Label>
                <div className="grid grid-cols-3 gap-2">
                  {CRYPTO_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCryptoCurrency(c.id)}
                      className={cn(
                        "rounded-xl border py-2.5 text-xs font-semibold",
                        cryptoCurrency === c.id ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
                      )}
                    >
                      {c.id}
                    </button>
                  ))}
                </div>

                <Label htmlFor="crypto-amount" className="mt-4">
                  Amount to deposit ({primaryAccount?.currency ?? "EUR"})
                </Label>
                <Input
                  id="crypto-amount"
                  type="number"
                  step="0.01"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                />

                <Button
                  size="lg"
                  className="mt-5 w-full"
                  disabled={cryptoMutation.isPending || !primaryAccount}
                  onClick={() => cryptoMutation.mutate()}
                >
                  {cryptoMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Generate deposit address
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Unlike card deposits, crypto is <strong>manual</strong> — held
                  as pending until the network confirms. Confirm it yourself
                  below, or an admin can approve it from Transaction
                  Management.
                </p>
              </>
            ) : (
              <div className="text-center">
                <Badge variant="warning" className="mb-3">Awaiting confirmation</Badge>
                <p className="text-sm text-muted-foreground">Send exactly</p>
                <p className="font-mono text-xl font-semibold tabular">{formatCurrency(pendingDeposit.amount, primaryAccount?.currency)}</p>
                <p className="mt-1 text-xs text-muted-foreground">worth of {cryptoCurrency} to:</p>
                <button
                  className="mx-auto mt-3 flex max-w-full items-center gap-2 rounded-xl bg-muted px-3 py-2.5 font-mono text-xs"
                  onClick={() => {
                    navigator.clipboard?.writeText(pendingDeposit.walletAddress);
                    toast.success("Address copied");
                  }}
                >
                  <span className="truncate">{pendingDeposit.walletAddress}</span>
                  <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
                <Button
                  size="lg"
                  className="mt-5 w-full"
                  disabled={confirmMutation.isPending}
                  onClick={() => confirmMutation.mutate(pendingDeposit.id)}
                >
                  {confirmMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  I&apos;ve sent the payment — simulate confirmation
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  In a real deployment this step would be automatic once the
                  blockchain confirms; an admin can also approve it from
                  Transaction Management.
                </p>
              </div>
            )}
          </Card>
        )}

        {tab === "giftcard" && (
          <Card className="p-4">
            <Label>Gift card provider</Label>
            <select
              value={giftProvider}
              onChange={(e) => setGiftProvider(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {GIFT_CARD_PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <Label className="mt-4">Card value</Label>
            <div className="grid grid-cols-4 gap-2">
              {GIFT_CARD_VALUES.map((v) => (
                <button
                  key={v}
                  onClick={() => setGiftValue(v)}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-semibold",
                    giftValue === v ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
                  )}
                >
                  {formatCurrency(v, primaryAccount?.currency)}
                </button>
              ))}
            </div>

            <Label htmlFor="gift-code" className="mt-4">
              Gift card code
            </Label>
            <Input
              id="gift-code"
              placeholder="e.g. AURA-2K9F-7XQ1-M4LP"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
            />

            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={giftCardMutation.isPending || !primaryAccount}
              onClick={() => giftCardMutation.mutate()}
            >
              {giftCardMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Redeem {formatCurrency(giftValue, primaryAccount?.currency)}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo tip: any code of 10+ characters is accepted — gift cards
              credit your account instantly, unlike crypto.
            </p>
          </Card>
        )}

        {tab === "manual" && (
          <Card className="p-4">
            {manualSubmitted ? (
              <div className="text-center">
                <Badge variant="warning" className="mb-3">Pending admin review</Badge>
                <p className="text-sm text-muted-foreground">
                  Your deposit of {formatCurrency(Number(manualAmount) || 0, primaryAccount?.currency)} is
                  submitted. Unlike card or gift card deposits, bank transfers are always confirmed manually
                  by an admin after they verify the payment arrived.
                </p>
                <Button
                  variant="outline"
                  className="mt-5 w-full"
                  onClick={() => {
                    setManualSubmitted(false);
                    setManualAmount("100");
                    setManualReference("");
                  }}
                >
                  Submit another deposit
                </Button>
              </div>
            ) : loadingPaymentAccounts ? (
              <Skeleton className="h-40 w-full" />
            ) : !paymentAccounts || paymentAccounts.length === 0 ? (
              <EmptyState icon={Landmark} title="No payment accounts available" description="Check back soon — the bank isn't accepting manual transfers right now." />
            ) : (
              <>
                <Label>Send your payment to</Label>
                <div className="space-y-2">
                  {paymentAccounts.map((pa) => (
                    <button
                      key={pa.id}
                      type="button"
                      onClick={() => setSelectedPaymentAccountId(pa.id)}
                      className={cn(
                        "w-full rounded-xl border p-3 text-left",
                        selectedPaymentAccountId === pa.id ? "border-emerald bg-mint-100" : "border-border"
                      )}
                    >
                      <p className="text-sm font-medium">{pa.label}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{pa.details}</p>
                    </button>
                  ))}
                </div>

                <Label htmlFor="manual-amount" className="mt-4">
                  Amount sent ({primaryAccount?.currency ?? "EUR"})
                </Label>
                <Input
                  id="manual-amount"
                  type="number"
                  step="0.01"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                />

                <Label htmlFor="manual-reference" className="mt-4">
                  Reference / proof (optional)
                </Label>
                <Input
                  id="manual-reference"
                  placeholder="e.g. transaction ID from your bank"
                  value={manualReference}
                  onChange={(e) => setManualReference(e.target.value)}
                />

                <Button
                  size="lg"
                  className="mt-5 w-full"
                  disabled={manualMutation.isPending || !selectedPaymentAccountId || !primaryAccount}
                  onClick={() => manualMutation.mutate()}
                >
                  {manualMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit deposit for review
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  <strong>Manual, admin-confirmed</strong> — send the payment to the account above first,
                  then submit this form. It won&apos;t reflect in your balance until an admin verifies it.
                </p>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
