import type { Account, Beneficiary, BankCard, InvestmentHolding, LoanApplication, LoanProduct, NotificationItem, PaymentAccount, SavingsGoal, Transaction } from "@/lib/types";
import type { TransferValues as TransferFormValues } from "@/lib/validations";
import { useSessionStore } from "@/lib/store";

/**
 * Service layer — every function here calls a real Next.js API route
 * (src/app/api/**), which in turn talks to Postgres via Prisma
 * (src/lib/prisma.ts). Nothing in this file holds application state itself;
 * it is a thin, swappable fetch wrapper. To point this app at a different
 * backend entirely, only this file needs to change.
 *
 * Every request carries an `x-user-id` header for the currently logged-in
 * user (see current-user.server.ts) so actions like "create a savings
 * goal" or "apply for a loan" affect that user's own data, not a hardcoded
 * demo account. This is a lightweight stand-in for real sessions — see the
 * README's "known limitations" section.
 */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const userId = useSessionStore.getState().user?.id;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(userId ? { "x-user-id": userId } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request to ${url} failed (${res.status})`);
  }
  return res.json();
}

// ---------- Accounts ----------
export async function fetchAccounts() {
  return request<Account[]>("/api/accounts");
}

// ---------- Transactions ----------
export async function fetchTransactions(params?: { accountId?: string; query?: string }) {
  const search = new URLSearchParams();
  if (params?.accountId) search.set("accountId", params.accountId);
  if (params?.query) search.set("query", params.query);
  const qs = search.toString();
  return request<Transaction[]>(`/api/transactions${qs ? `?${qs}` : ""}`);
}

// ---------- Cards ----------
export async function fetchCards() {
  return request<BankCard[]>("/api/cards");
}

export async function setCardStatus(cardId: string, status: "active" | "frozen" | "blocked") {
  return request<BankCard>(`/api/cards/${cardId}/status`, { method: "POST", body: JSON.stringify({ status }) });
}

// ---------- Beneficiaries ----------
export async function fetchBeneficiaries() {
  return request<Beneficiary[]>("/api/beneficiaries");
}

export async function addBeneficiary(input: Omit<Beneficiary, "id" | "favourite">) {
  return request<Beneficiary>("/api/beneficiaries", { method: "POST", body: JSON.stringify(input) });
}

export async function removeBeneficiary(id: string) {
  return request<{ id: string }>(`/api/beneficiaries/${id}`, { method: "DELETE" });
}

export async function toggleFavouriteBeneficiary(id: string) {
  return request<Beneficiary>(`/api/beneficiaries/${id}/favourite`, { method: "POST" });
}

// ---------- Transfers ----------
export async function verifyTransferPin(pin: string) {
  return request<boolean>("/api/transfers/verify-pin", { method: "POST", body: JSON.stringify({ pin }) });
}

export async function submitTransfer(input: TransferFormValues) {
  return request<Transaction>("/api/transfers", { method: "POST", body: JSON.stringify(input) });
}

// ---------- Deposits ----------
export interface DepositInput {
  accountId: string;
  method: "crypto" | "giftcard" | "card" | "manual";
  amount?: number;
  cryptoCurrency?: "BTC" | "ETH" | "USDT";
  giftCardCode?: string;
  giftCardProvider?: string;
  cardLast4?: string;
  paymentAccountId?: string;
  reference?: string;
}

export async function createDeposit(input: DepositInput) {
  return request<Transaction & { walletAddress?: string }>("/api/deposits", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchPaymentAccounts() {
  return request<PaymentAccount[]>("/api/payment-accounts");
}

export async function resolveTransaction(id: string, action: "approve" | "reject") {
  return request<Transaction>(`/api/transactions/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

// ---------- Notifications ----------
export async function fetchNotifications() {
  return request<NotificationItem[]>("/api/notifications");
}

export async function markNotificationRead(id: string) {
  return request<NotificationItem>(`/api/notifications/${id}/read`, { method: "POST" });
}

export async function markAllNotificationsRead() {
  return request<{ ok: boolean }>("/api/notifications/read-all", { method: "POST" });
}

// ---------- Loans ----------
export async function fetchLoans() {
  return request<{ applications: LoanApplication[]; products: LoanProduct[] }>("/api/loans");
}

export async function applyForLoan(productId: string, amount: number, termMonths: number) {
  return request<LoanApplication>("/api/loans", { method: "POST", body: JSON.stringify({ productId, amount, termMonths }) });
}

// ---------- Savings ----------
export async function fetchSavingsGoals() {
  return request<SavingsGoal[]>("/api/savings");
}

export async function createSavingsGoal(input: { name: string; target: number; emoji: string; type: "flexible" | "fixed" | "auto" }) {
  return request<SavingsGoal>("/api/savings", { method: "POST", body: JSON.stringify(input) });
}

export async function addFundsToGoal(goalId: string, amount: number, accountId: string) {
  return request<SavingsGoal>(`/api/savings/${goalId}/add-funds`, { method: "POST", body: JSON.stringify({ amount, accountId }) });
}

// ---------- Investments ----------
export async function fetchInvestments() {
  return request<InvestmentHolding[]>("/api/investments");
}

// ---------- Analytics ----------
export async function fetchAnalytics() {
  return request<{
    spendingByMonth: { month: string; income: number; expenses: number }[];
    spendingByCategory: { category: string; value: number; color: string }[];
  }>("/api/analytics");
}

// ---------- Current user (live from DB) ----------
export interface MeResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarInitials: string;
  kycStatus: "unverified" | "pending" | "verified";
  tier: "standard" | "premium" | "business";
  securityScore: number;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export async function fetchMe() {
  return request<MeResponse>("/api/me");
}

export async function submitKycDocuments() {
  return request<{ kycStatus: string }>("/api/kyc/submit", { method: "POST" });
}

export async function fetchMyLoginHistory() {
  return request<{ id: string; success: boolean; ip: string; createdAt: string }[]>("/api/security/login-history");
}

// ---------- Auth ----------
export async function registerUser(input: { fullName: string; email: string; phone: string; password: string }) {
  return request<{ userId: string; requiresEmailVerification: boolean }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(email: string, password: string) {
  return request<{ userId: string; requiresOtp: boolean }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyOtp(userId: string, code: string, purpose: "email" | "phone" | "login") {
  return request<{
    verified: boolean;
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      avatarInitials: string;
      kycStatus: string;
      tier: string;
      securityScore: number;
    };
  }>("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ userId, code, purpose }) });
}

export async function resendOtp(userId: string, purpose: "email" | "phone" | "login") {
  return request<{ ok: boolean }>("/api/auth/resend-otp", { method: "POST", body: JSON.stringify({ userId, purpose }) });
}
