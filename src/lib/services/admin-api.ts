import type { AdminCustomer, PaymentAccount, Transaction } from "@/lib/types";
import { useAdminSessionStore, type AdminSession } from "@/lib/admin-store";

/**
 * Admin-only service layer. Every call attaches an `x-admin-id` header
 * from the admin session store (see admin-store.ts) — a lightweight stand-
 * in for real sessions, same caveat as the customer-facing api.ts. Kept in
 * a separate file/header from the customer session on purpose: an admin
 * and a customer session are different identities even in the same
 * browser.
 */
async function adminRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const adminId = useAdminSessionStore.getState().admin?.id;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(adminId ? { "x-admin-id": adminId } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request to ${url} failed (${res.status})`);
  }
  return res.json();
}

// ---------- Admin auth ----------
export async function registerAdmin(input: { fullName: string; email: string; password: string }) {
  return adminRequest<AdminSession>("/api/admin/auth/register", { method: "POST", body: JSON.stringify(input) });
}

export async function loginAdmin(email: string, password: string) {
  return adminRequest<AdminSession>("/api/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function fetchCurrentAdmin() {
  return adminRequest<AdminSession>("/api/admin/me");
}

export interface AdminDashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalBalance: number;
  transfersToday: number;
  pendingApprovals: number;
  activeLoans: number;
  depositsThisMonth: number;
  withdrawalsThisMonth: number;
  newCustomersByMonth: { month: string; count: number }[];
}

export async function fetchAdminStats() {
  return adminRequest<AdminDashboardStats>("/api/admin/stats");
}

export async function downloadBackup() {
  const adminId = useAdminSessionStore.getState().admin?.id;
  const res = await fetch("/api/admin/backup", {
    headers: adminId ? { "x-admin-id": adminId } : {},
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Backup download failed (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `banco-aurora-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- Super admin ----------
export interface AdminSummary {
  id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "admin";
  status: "active" | "suspended";
  suspensionReason: string | null;
  createdAt: string;
  usersCreated: number;
}

export async function fetchAdmins() {
  return adminRequest<AdminSummary[]>("/api/admin/admins");
}

export async function updateAdminStatus(id: string, status: "active" | "suspended", reason?: string) {
  return adminRequest<{ id: string; status: string; suspensionReason: string | null }>(`/api/admin/admins/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, reason }),
  });
}

export interface SuperAdminStats {
  totalAdmins: number;
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  frozenUsers: number;
  pendingKyc: number;
  totalPaymentAccounts: number;
}

export async function fetchSuperStats() {
  return adminRequest<SuperAdminStats>("/api/admin/super/stats");
}

// ---------- Customers ----------
export async function fetchAdminCustomers() {
  return adminRequest<AdminCustomer[]>("/api/admin/customers");
}

export async function fetchAdminCustomerDetail(id: string) {
  return adminRequest<AdminCustomer>(`/api/admin/customers/${id}`);
}

export async function createAdminCustomer(input: {
  name: string;
  email: string;
  phone?: string;
  initialDeposit?: number;
  specialNeeds?: string[];
}) {
  return adminRequest<AdminCustomer & { tempPassword: string }>("/api/admin/customers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAdminCustomer(
  id: string,
  patch: { status?: "active" | "suspended" | "frozen"; kyc?: "verified" | "rejected"; specialNeeds?: string[] }
) {
  return adminRequest<AdminCustomer>(`/api/admin/customers/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteAdminCustomer(id: string) {
  return adminRequest<{ id: string }>(`/api/admin/customers/${id}`, { method: "DELETE" });
}

export async function addCustomerActivity(id: string, input: { type: "credit" | "debit"; amount: number; description: string }) {
  return adminRequest<Transaction>(`/api/admin/customers/${id}/activity`, { method: "POST", body: JSON.stringify(input) });
}

// ---------- Security ----------
export interface AdminLoginAttempt {
  id: string;
  email: string;
  success: boolean;
  ip: string;
  createdAt: string;
}

export async function fetchLoginAttempts() {
  return adminRequest<AdminLoginAttempt[]>("/api/admin/login-attempts");
}

// ---------- KYC ----------
export interface AdminKycUser {
  id: string;
  name: string;
  email: string;
  kycStatus: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  submitted: string;
}

export async function fetchKycQueue() {
  return adminRequest<AdminKycUser[]>("/api/admin/kyc");
}

export async function resolveKyc(id: string, action: "approve" | "reject") {
  return adminRequest<{ id: string; kycStatus: string }>(`/api/admin/kyc/${id}`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

// ---------- Verification codes ----------
export interface AdminVerificationCode {
  id: string;
  userName: string;
  userEmail: string;
  code: string;
  purpose: "email" | "phone" | "login";
  destination: string;
  used: boolean;
  expired: boolean;
  expiresAt: string;
  createdAt: string;
}

export async function fetchVerificationCodes() {
  return adminRequest<AdminVerificationCode[]>("/api/admin/verification-codes");
}

// ---------- Payment accounts (deposit destinations admins manage) ----------
export async function fetchAdminPaymentAccounts() {
  return adminRequest<PaymentAccount[]>("/api/admin/payment-accounts");
}

export async function createPaymentAccount(input: { label: string; type: "bank" | "crypto" | "mobile_money"; details: string; currency?: string }) {
  return adminRequest<PaymentAccount>("/api/admin/payment-accounts", { method: "POST", body: JSON.stringify(input) });
}

export async function togglePaymentAccount(id: string, active: boolean) {
  return adminRequest<PaymentAccount>(`/api/admin/payment-accounts/${id}`, { method: "PATCH", body: JSON.stringify({ active }) });
}

export async function deletePaymentAccount(id: string) {
  return adminRequest<{ id: string }>(`/api/admin/payment-accounts/${id}`, { method: "DELETE" });
}
