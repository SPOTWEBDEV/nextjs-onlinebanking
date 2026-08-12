import type {
  Account as PrismaAccount,
  Transaction as PrismaTransaction,
  Beneficiary as PrismaBeneficiary,
  Card as PrismaCard,
  Notification as PrismaNotification,
  LoanApplication as PrismaLoanApplication,
  LoanProduct as PrismaLoanProduct,
  SavingsGoal as PrismaSavingsGoal,
  User as PrismaUser,
  PaymentAccount as PrismaPaymentAccount,
} from "@prisma/client";
import type {
  Account,
  Transaction,
  Beneficiary,
  BankCard,
  NotificationItem,
  LoanApplication,
  LoanProduct,
  SavingsGoal,
  AdminCustomer,
  PaymentAccount,
} from "@/lib/types";

const num = (v: unknown) => Number(v);

export function serializeAccount(a: PrismaAccount): Account {
  return {
    id: a.id,
    nickname: a.nickname,
    type: a.type === "fixed_deposit" ? "fixed-deposit" : (a.type as Account["type"]),
    accountNumber: a.accountNumber,
    iban: a.iban,
    nib: a.nib,
    swiftCode: a.swiftCode,
    currency: a.currency,
    balance: num(a.balance),
    availableBalance: num(a.availableBalance),
    ledgerBalance: num(a.ledgerBalance),
    status: a.status,
  };
}

export function serializeTransaction(t: PrismaTransaction): Transaction {
  return {
    id: t.id,
    date: t.date.toISOString().slice(0, 10),
    description: t.description,
    counterparty: t.counterparty,
    category: t.category,
    type: t.type,
    amount: num(t.amount),
    currency: t.currency,
    status: t.status,
    reference: t.reference,
    accountId: t.accountId,
  };
}

export function serializeBeneficiary(b: PrismaBeneficiary): Beneficiary {
  return {
    id: b.id,
    name: b.name,
    bank: b.bank,
    accountNumber: b.accountNumber,
    currency: b.currency,
    favourite: b.favourite,
    type: b.type,
  };
}

export function serializeCard(c: PrismaCard): BankCard {
  return {
    id: c.id,
    holder: c.holder,
    numberMasked: c.numberMasked,
    fullNumber: c.fullNumber,
    expiry: c.expiry,
    cvv: c.cvv,
    brand: c.brand,
    type: c.type,
    status: c.status,
    spendLimit: num(c.spendLimit),
    spentThisMonth: num(c.spentThisMonth),
    currency: c.currency,
  };
}

export function serializeNotification(n: PrismaNotification): NotificationItem {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    category: n.category,
    read: n.read,
    date: n.date.toISOString(),
  };
}

export function serializeLoanApplication(
  l: PrismaLoanApplication & { product: PrismaLoanProduct }
): LoanApplication {
  return {
    id: l.id,
    productName: l.product.name,
    amount: num(l.amount),
    termMonths: l.termMonths,
    status: l.status,
    nextPaymentDate: (l.nextPaymentDate ?? l.createdAt).toISOString().slice(0, 10),
    nextPaymentAmount: num(l.nextPaymentAmount),
    remainingBalance: num(l.remainingBalance),
  };
}

export function serializeLoanProduct(p: PrismaLoanProduct): LoanProduct {
  return {
    id: p.id,
    name: p.name,
    rate: num(p.rate),
    maxAmount: num(p.maxAmount),
    maxTermMonths: p.maxTermMonths,
    description: p.description,
  };
}

export function serializeSavingsGoal(g: PrismaSavingsGoal): SavingsGoal {
  return {
    id: g.id,
    name: g.name,
    target: num(g.target),
    saved: num(g.saved),
    emoji: g.emoji,
    type: g.type,
  };
}

export function serializeAdminCustomer(u: PrismaUser, balance: number): AdminCustomer {
  return {
    id: u.id,
    name: u.fullName,
    email: u.email,
    phone: u.phone,
    status: u.status,
    kyc: u.kycStatus,
    joined: u.createdAt.toISOString().slice(0, 10),
    balance,
    specialNeeds: u.specialNeeds,
  };
}

export function serializePaymentAccount(p: PrismaPaymentAccount): PaymentAccount {
  return {
    id: p.id,
    label: p.label,
    type: p.type,
    details: p.details,
    currency: p.currency,
    active: p.active,
  };
}
