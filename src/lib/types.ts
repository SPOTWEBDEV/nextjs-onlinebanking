export type AccountType = "current" | "savings" | "business" | "fixed-deposit";
export type AccountStatus = "active" | "dormant" | "frozen" | "closed";

export interface Account {
  id: string;
  nickname: string;
  type: AccountType;
  accountNumber: string;
  iban: string;
  nib: string;
  swiftCode: string;
  currency: string;
  balance: number;
  availableBalance: number;
  ledgerBalance: number;
  status: AccountStatus;
}

export type TransactionType = "credit" | "debit";
export type TransactionCategory =
  | "transfer"
  | "bills"
  | "shopping"
  | "food"
  | "transport"
  | "income"
  | "entertainment"
  | "subscription"
  | "loan"
  | "savings"
  | "atm";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  counterparty: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  accountId: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  currency: string;
  favourite: boolean;
  type: "local" | "international" | "internal";
}

export type CardStatus = "active" | "frozen" | "blocked";
export interface BankCard {
  id: string;
  holder: string;
  numberMasked: string;
  fullNumber: string;
  expiry: string;
  cvv: string;
  brand: "visa" | "mastercard";
  type: "physical" | "virtual";
  status: CardStatus;
  spendLimit: number;
  spentThisMonth: number;
  currency: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: "transaction" | "security" | "promotion" | "loan" | "card";
  read: boolean;
  date: string;
}

export interface LoanProduct {
  id: string;
  name: string;
  rate: number;
  maxAmount: number;
  maxTermMonths: number;
  description: string;
}

export interface LoanApplication {
  id: string;
  productName: string;
  amount: number;
  termMonths: number;
  status: "pending" | "approved" | "rejected" | "active" | "closed";
  nextPaymentDate: string;
  nextPaymentAmount: number;
  remainingBalance: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  emoji: string;
  type: "flexible" | "fixed" | "auto";
}

export interface InvestmentHolding {
  id: string;
  name: string;
  ticker: string;
  units: number;
  value: number;
  costBasis: number;
  changePct: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarInitials: string;
  kycStatus: "unverified" | "pending" | "verified";
  tier: "standard" | "premium" | "business";
  securityScore: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "frozen";
  kyc: "pending" | "verified" | "rejected";
  joined: string;
  balance: number;
}
