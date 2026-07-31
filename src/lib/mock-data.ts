import type {
  Account,
  AdminCustomer,
  BankCard,
  Beneficiary,
  InvestmentHolding,
  LoanApplication,
  LoanProduct,
  NotificationItem,
  SavingsGoal,
  Transaction,
  User,
} from "./types";

/**
 * Seed data for Banco Aurora, a fictional Portuguese digital bank.
 * This file is used both as fallback demo data and as the source for the
 * Prisma seed script (prisma/seed.ts) once a real database is connected.
 */

export const currentUser: User = {
  id: "usr_01",
  fullName: "Mariana Costa",
  email: "mariana.costa@example.com",
  phone: "+351 912 345 678",
  avatarInitials: "MC",
  kycStatus: "verified",
  tier: "premium",
  securityScore: 82,
};

export const accounts: Account[] = [
  {
    id: "acc_current",
    nickname: "Conta Corrente",
    type: "current",
    accountNumber: "0035 0123 4567 8901",
    iban: "PT50 0035 0123 0004 5678 9017 9",
    nib: "0035 0123 00045678901 79",
    swiftCode: "AURAPTPL",
    currency: "EUR",
    balance: 18420.62,
    availableBalance: 18120.62,
    ledgerBalance: 18420.62,
    status: "active",
  },
  {
    id: "acc_savings",
    nickname: "Poupança Reserva",
    type: "savings",
    accountNumber: "0035 0123 9902 1145",
    iban: "PT50 0035 0123 0009 9021 1452 1",
    nib: "0035 0123 00099021145 21",
    swiftCode: "AURAPTPL",
    currency: "EUR",
    balance: 9280.0,
    availableBalance: 9280.0,
    ledgerBalance: 9280.0,
    status: "active",
  },
  {
    id: "acc_fixed",
    nickname: "Depósito a Prazo 12 meses",
    type: "fixed-deposit",
    accountNumber: "0035 0123 3114 5567",
    iban: "PT50 0035 0123 0003 1145 5673 4",
    nib: "0035 0123 00031145567 34",
    swiftCode: "AURAPTPL",
    currency: "EUR",
    balance: 15000.0,
    availableBalance: 0,
    ledgerBalance: 15000.0,
    status: "active",
  },
];

export const transactions: Transaction[] = [
  { id: "tx_001", date: "2026-07-27", description: "Continente", counterparty: "Continente Alfragide", category: "food", type: "debit", amount: 64.12, currency: "EUR", status: "completed", reference: "REF-88213", accountId: "acc_current" },
  { id: "tx_002", date: "2026-07-27", description: "Salário — Nimbus Lda", counterparty: "Nimbus Lda", category: "income", type: "credit", amount: 4200.0, currency: "EUR", status: "completed", reference: "REF-88214", accountId: "acc_current" },
  { id: "tx_003", date: "2026-07-26", description: "Bolt", counterparty: "Bolt Viagem", category: "transport", type: "debit", amount: 18.4, currency: "EUR", status: "completed", reference: "REF-88190", accountId: "acc_current" },
  { id: "tx_004", date: "2026-07-25", description: "Fatura de eletricidade", counterparty: "EDP Comercial", category: "bills", type: "debit", amount: 132.5, currency: "EUR", status: "completed", reference: "REF-88155", accountId: "acc_current" },
  { id: "tx_005", date: "2026-07-24", description: "Transferência para J. Ferreira", counterparty: "João Ferreira", category: "transfer", type: "debit", amount: 500.0, currency: "EUR", status: "completed", reference: "REF-88102", accountId: "acc_current" },
  { id: "tx_006", date: "2026-07-24", description: "Spotify", counterparty: "Spotify AB", category: "subscription", type: "debit", amount: 11.99, currency: "EUR", status: "completed", reference: "REF-88099", accountId: "acc_current" },
  { id: "tx_007", date: "2026-07-23", description: "Zara", counterparty: "Zara Chiado", category: "shopping", type: "debit", amount: 89.0, currency: "EUR", status: "completed", reference: "REF-88044", accountId: "acc_current" },
  { id: "tx_008", date: "2026-07-22", description: "Levantamento Multibanco", counterparty: "Multibanco — Av. da Liberdade", category: "atm", type: "debit", amount: 200.0, currency: "EUR", status: "completed", reference: "REF-87990", accountId: "acc_current" },
  { id: "tx_009", date: "2026-07-21", description: "Cinema NOS", counterparty: "NOS Cinemas", category: "entertainment", type: "debit", amount: 32.0, currency: "EUR", status: "completed", reference: "REF-87942", accountId: "acc_current" },
  { id: "tx_010", date: "2026-07-20", description: "Prestação de crédito pessoal", counterparty: "Crédito Pessoal Banco Aurora", category: "loan", type: "debit", amount: 310.75, currency: "EUR", status: "completed", reference: "REF-87890", accountId: "acc_current" },
  { id: "tx_011", date: "2026-07-19", description: "Transferência para Poupança", counterparty: "Poupança Reserva", category: "savings", type: "debit", amount: 300.0, currency: "EUR", status: "completed", reference: "REF-87820", accountId: "acc_current" },
  { id: "tx_012", date: "2026-07-18", description: "Pagamento freelance", counterparty: "Orbit Studio", category: "income", type: "credit", amount: 950.0, currency: "EUR", status: "pending", reference: "REF-87799", accountId: "acc_current" },
];

export const beneficiaries: Beneficiary[] = [
  { id: "ben_1", name: "João Ferreira", bank: "Banco Aurora", accountNumber: "PT50 0035 0111 0004 1124 4771 2", currency: "EUR", favourite: true, type: "internal" },
  { id: "ben_2", name: "Catarina Nunes", bank: "Novo Atlântico Bank", accountNumber: "PT50 0033 0221 0003 3902 2118 7", currency: "EUR", favourite: true, type: "local" },
  { id: "ben_3", name: "Elena Marchetti", bank: "Banca Adriatica", accountNumber: "IT60X0542811101000000123456", currency: "EUR", favourite: false, type: "international" },
  { id: "ben_4", name: "Orbit Studio LLC", bank: "Northline Bank", accountNumber: "PT50 0012 0207 0005 5122 0773 4", currency: "EUR", favourite: false, type: "local" },
];

export const cards: BankCard[] = [
  { id: "card_1", holder: "Mariana Costa", numberMasked: "4021 •••• •••• 8834", fullNumber: "4021 5588 2210 8834", expiry: "09/29", cvv: "482", brand: "visa", type: "physical", status: "active", spendLimit: 5000, spentThisMonth: 1420.3, currency: "EUR" },
  { id: "card_2", holder: "Mariana Costa", numberMasked: "5412 •••• •••• 2201", fullNumber: "5412 7734 9910 2201", expiry: "03/28", cvv: "917", brand: "mastercard", type: "virtual", status: "active", spendLimit: 1000, spentThisMonth: 268.5, currency: "EUR" },
];

export const notifications: NotificationItem[] = [
  { id: "n1", title: "Pagamento recebido", body: "Recebeu 950,00 € de Orbit Studio.", category: "transaction", read: false, date: "2026-07-28T09:12:00" },
  { id: "n2", title: "Novo início de sessão detetado", body: "Novo início de sessão via Chrome no Windows, Lisboa, PT.", category: "security", read: false, date: "2026-07-27T21:40:00" },
  { id: "n3", title: "Cartão utilizado online", body: "O seu cartão virtual foi utilizado na Orbit Studio no valor de 268,50 €.", category: "card", read: true, date: "2026-07-26T14:02:00" },
  { id: "n4", title: "Prestação de crédito em 5 dias", body: "A sua próxima prestação de 310,75 € vence a 2 de agosto.", category: "loan", read: true, date: "2026-07-24T08:00:00" },
  { id: "n5", title: "Taxa de poupança por tempo limitado", body: "Garanta 4,8% TANB em novos depósitos a prazo de 12 meses.", category: "promotion", read: true, date: "2026-07-20T10:00:00" },
];

export const loanProducts: LoanProduct[] = [
  { id: "lp_1", name: "Crédito Pessoal", rate: 8.9, maxAmount: 25000, maxTermMonths: 48, description: "Financiamento flexível para o que a vida trouxer." },
  { id: "lp_2", name: "Crédito Automóvel", rate: 6.9, maxAmount: 60000, maxTermMonths: 72, description: "Financie um veículo novo ou usado." },
  { id: "lp_3", name: "Crédito Habitação — Obras", rate: 4.75, maxAmount: 40000, maxTermMonths: 60, description: "Remodele, amplie ou repare a sua casa." },
];

export const loanApplications: LoanApplication[] = [
  { id: "la_1", productName: "Crédito Pessoal", amount: 8000, termMonths: 24, status: "active", nextPaymentDate: "2026-08-02", nextPaymentAmount: 310.75, remainingBalance: 5210.4 },
];

export const savingsGoals: SavingsGoal[] = [
  { id: "sg_1", name: "Fundo de Emergência", target: 10000, saved: 6420, emoji: "🛟", type: "flexible" },
  { id: "sg_2", name: "Viagem ao Japão", target: 4000, saved: 1180, emoji: "🗼", type: "auto" },
  { id: "sg_3", name: "Novo MacBook", target: 2200, saved: 2200, emoji: "💻", type: "fixed" },
];

export const investmentHoldings: InvestmentHolding[] = [
  { id: "inv_1", name: "Índice Ações Globais", ticker: "GEQI", units: 42.5, value: 6180.25, costBasis: 5400.0, changePct: 14.5 },
  { id: "inv_2", name: "Fundo Obrigações Aurora", ticker: "AURB", units: 120, value: 3120.0, costBasis: 3000.0, changePct: 4.0 },
  { id: "inv_3", name: "Mercados Emergentes", ticker: "EMGX", units: 30, value: 1890.0, costBasis: 2100.0, changePct: -10.0 },
];

export const spendingByMonth = [
  { month: "Fev", income: 4200, expenses: 3120 },
  { month: "Mar", income: 4200, expenses: 3480 },
  { month: "Abr", income: 4600, expenses: 3010 },
  { month: "Mai", income: 4200, expenses: 3920 },
  { month: "Jun", income: 5150, expenses: 3340 },
  { month: "Jul", income: 5150, expenses: 2890 },
];

export const spendingByCategory = [
  { category: "Alimentação", value: 640, color: "#2FAE8B" },
  { category: "Contas", value: 420, color: "#0F6B5C" },
  { category: "Compras", value: 310, color: "#C9A227" },
  { category: "Transportes", value: 180, color: "#7C8AA5" },
  { category: "Lazer", value: 150, color: "#E4572E" },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "cus_1", name: "Mariana Costa", email: "mariana.costa@example.com", status: "active", kyc: "verified", joined: "2024-02-11", balance: 42700.62 },
  { id: "cus_2", name: "Daniel Reyes", email: "daniel.reyes@example.com", status: "active", kyc: "verified", joined: "2023-11-02", balance: 12980.0 },
  { id: "cus_3", name: "Beatriz Santos", email: "beatriz.santos@example.com", status: "suspended", kyc: "pending", joined: "2025-01-19", balance: 340.5 },
  { id: "cus_4", name: "Tiago Almeida", email: "tiago.almeida@example.com", status: "active", kyc: "verified", joined: "2022-06-30", balance: 88410.25 },
  { id: "cus_5", name: "Inês Pereira", email: "ines.pereira@example.com", status: "frozen", kyc: "rejected", joined: "2025-05-14", balance: 0 },
  { id: "cus_6", name: "Lucas Bergström", email: "lucas.b@example.com", status: "active", kyc: "verified", joined: "2024-09-08", balance: 5620.9 },
];

export const adminStats = {
  totalCustomers: 48213,
  activeUsers: 31940,
  totalDeposits: 184_320_910,
  totalWithdrawals: 92_110_400,
  transfersToday: 18_204,
  pendingRequests: 37,
  revenueThisMonth: 1_284_500,
};
