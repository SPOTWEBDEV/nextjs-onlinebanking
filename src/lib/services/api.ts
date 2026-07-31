import type { Account, AdminCustomer, Beneficiary, BankCard, InvestmentHolding, LoanApplication, LoanProduct, NotificationItem, SavingsGoal, Transaction } from "@/lib/types";
import type { TransferValues as TransferFormValues } from "@/lib/validations";

/**
 * Service layer — every function here calls a real Next.js API route
 * (src/app/api/**), which in turn talks to Postgres via Prisma
 * (src/lib/prisma.ts). Nothing in this file holds application state itself;
 * it is a thin, swappable fetch wrapper. To point this app at a different
 * backend entirely, only this file needs to change.
 */

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
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

export async function addFundsToGoal(goalId: string, amount: number) {
  return request<SavingsGoal>(`/api/savings/${goalId}/add-funds`, { method: "POST", body: JSON.stringify({ amount }) });
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

// ---------- Admin: Customers ----------
export async function fetchAdminCustomers() {
  return request<AdminCustomer[]>("/api/admin/customers");
}

export async function createAdminCustomer(input: { name: string; email: string }) {
  return request<AdminCustomer>("/api/admin/customers", { method: "POST", body: JSON.stringify(input) });
}

export async function updateAdminCustomer(
  id: string,
  patch: { status?: "active" | "suspended" | "frozen"; kyc?: "verified" }
) {
  return request<AdminCustomer>(`/api/admin/customers/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteAdminCustomer(id: string) {
  return request<{ id: string }>(`/api/admin/customers/${id}`, { method: "DELETE" });
}

// ---------- Auth (mock) ----------
export async function mockLogin(email: string, password: string) {
  return request<{ token: string; requiresOtp: boolean }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function mockVerifyOtp(code: string) {
  return request<{ verified: boolean }>("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ code }) });
}
