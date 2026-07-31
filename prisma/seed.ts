import { PrismaClient, type TransactionCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Banco Aurora demo data…");

  // Clear existing demo data (idempotent re-seeding)
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.card.deleteMany();
  await prisma.beneficiary.deleteMany();
  await prisma.loanApplication.deleteMany();
  await prisma.loanProduct.deleteMany();
  await prisma.savingsGoal.deleteMany();
  await prisma.investmentHolding.deleteMany();
  await prisma.adminCustomerView.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      fullName: "Mariana Costa",
      email: "mariana.costa@example.com",
      phone: "+351 912 345 678",
      avatarInitials: "MC",
      kycStatus: "verified",
      tier: "premium",
      securityScore: 82,
      transferPinHash: "1234", // demo only — hash this in production
    },
  });

  const current = await prisma.account.create({
    data: {
      userId: user.id,
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
  });

  await prisma.account.create({
    data: {
      userId: user.id,
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
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      nickname: "Depósito a Prazo 12 meses",
      type: "fixed_deposit",
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
  });

  const transactions: {
    description: string;
    counterparty: string;
    category: TransactionCategory;
    type: "credit" | "debit";
    amount: number;
    status: "completed" | "pending";
    reference: string;
    daysAgo: number;
  }[] = [
    { description: "Continente", counterparty: "Continente Alfragide", category: "food", type: "debit", amount: 64.12, status: "completed", reference: "REF-88213", daysAgo: 3 },
    { description: "Salário — Nimbus Lda", counterparty: "Nimbus Lda", category: "income", type: "credit", amount: 4200.0, status: "completed", reference: "REF-88214", daysAgo: 3 },
    { description: "Bolt", counterparty: "Bolt Viagem", category: "transport", type: "debit", amount: 18.4, status: "completed", reference: "REF-88190", daysAgo: 4 },
    { description: "Fatura de eletricidade", counterparty: "EDP Comercial", category: "bills", type: "debit", amount: 132.5, status: "completed", reference: "REF-88155", daysAgo: 5 },
    { description: "Transferência para J. Ferreira", counterparty: "João Ferreira", category: "transfer", type: "debit", amount: 500.0, status: "completed", reference: "REF-88102", daysAgo: 6 },
    { description: "Spotify", counterparty: "Spotify AB", category: "subscription", type: "debit", amount: 11.99, status: "completed", reference: "REF-88099", daysAgo: 6 },
    { description: "Zara", counterparty: "Zara Chiado", category: "shopping", type: "debit", amount: 89.0, status: "completed", reference: "REF-88044", daysAgo: 7 },
    { description: "Levantamento Multibanco", counterparty: "Multibanco — Av. da Liberdade", category: "atm", type: "debit", amount: 200.0, status: "completed", reference: "REF-87990", daysAgo: 8 },
    { description: "Cinema NOS", counterparty: "NOS Cinemas", category: "entertainment", type: "debit", amount: 32.0, status: "completed", reference: "REF-87942", daysAgo: 9 },
    { description: "Prestação de crédito pessoal", counterparty: "Crédito Pessoal Banco Aurora", category: "loan", type: "debit", amount: 310.75, status: "completed", reference: "REF-87890", daysAgo: 10 },
    { description: "Transferência para Poupança", counterparty: "Poupança Reserva", category: "savings", type: "debit", amount: 300.0, status: "completed", reference: "REF-87820", daysAgo: 11 },
    { description: "Pagamento freelance", counterparty: "Orbit Studio", category: "income", type: "credit", amount: 950.0, status: "pending", reference: "REF-87799", daysAgo: 12 },
  ];

  for (const t of transactions) {
    await prisma.transaction.create({
      data: {
        accountId: current.id,
        description: t.description,
        counterparty: t.counterparty,
        category: t.category,
        type: t.type,
        amount: t.amount,
        currency: "EUR",
        status: t.status,
        reference: t.reference,
        date: new Date(Date.now() - t.daysAgo * 86400000),
      },
    });
  }

  await prisma.beneficiary.createMany({
    data: [
      { userId: user.id, name: "João Ferreira", bank: "Banco Aurora", accountNumber: "PT50 0035 0111 0004 1124 4771 2", currency: "EUR", favourite: true, type: "internal" },
      { userId: user.id, name: "Catarina Nunes", bank: "Novo Atlântico Bank", accountNumber: "PT50 0033 0221 0003 3902 2118 7", currency: "EUR", favourite: true, type: "local" },
      { userId: user.id, name: "Elena Marchetti", bank: "Banca Adriatica", accountNumber: "IT60X0542811101000000123456", currency: "EUR", favourite: false, type: "international" },
      { userId: user.id, name: "Orbit Studio LLC", bank: "Northline Bank", accountNumber: "PT50 0012 0207 0005 5122 0773 4", currency: "EUR", favourite: false, type: "local" },
    ],
  });

  await prisma.card.createMany({
    data: [
      { userId: user.id, holder: "Mariana Costa", numberMasked: "4021 •••• •••• 8834", fullNumber: "4021 5588 2210 8834", expiry: "09/29", cvv: "482", brand: "visa", type: "physical", status: "active", spendLimit: 5000, spentThisMonth: 1420.3, currency: "EUR" },
      { userId: user.id, holder: "Mariana Costa", numberMasked: "5412 •••• •••• 2201", fullNumber: "5412 7734 9910 2201", expiry: "03/28", cvv: "917", brand: "mastercard", type: "virtual", status: "active", spendLimit: 1000, spentThisMonth: 268.5, currency: "EUR" },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: user.id, title: "Pagamento recebido", body: "Recebeu 950,00 € de Orbit Studio.", category: "transaction", read: false },
      { userId: user.id, title: "Novo início de sessão detetado", body: "Novo início de sessão via Chrome no Windows, Lisboa, PT.", category: "security", read: false },
      { userId: user.id, title: "Cartão utilizado online", body: "O seu cartão virtual foi utilizado na Orbit Studio no valor de 268,50 €.", category: "card", read: true },
      { userId: user.id, title: "Prestação de crédito em 5 dias", body: "A sua próxima prestação de 310,75 € vence a 2 de agosto.", category: "loan", read: true },
      { userId: user.id, title: "Taxa de poupança por tempo limitado", body: "Garanta 4,8% TANB em novos depósitos a prazo de 12 meses.", category: "promotion", read: true },
    ],
  });

  const personalLoan = await prisma.loanProduct.create({
    data: { name: "Crédito Pessoal", rate: 8.9, maxAmount: 25000, maxTermMonths: 48, description: "Financiamento flexível para o que a vida trouxer." },
  });
  await prisma.loanProduct.create({
    data: { name: "Crédito Automóvel", rate: 6.9, maxAmount: 60000, maxTermMonths: 72, description: "Financie um veículo novo ou usado." },
  });
  await prisma.loanProduct.create({
    data: { name: "Crédito Habitação — Obras", rate: 4.75, maxAmount: 40000, maxTermMonths: 60, description: "Remodele, amplie ou repare a sua casa." },
  });

  await prisma.loanApplication.create({
    data: {
      userId: user.id,
      productId: personalLoan.id,
      amount: 8000,
      termMonths: 24,
      status: "active",
      nextPaymentDate: new Date(Date.now() + 4 * 86400000),
      nextPaymentAmount: 310.75,
      remainingBalance: 5210.4,
    },
  });

  await prisma.savingsGoal.createMany({
    data: [
      { userId: user.id, name: "Fundo de Emergência", target: 10000, saved: 6420, emoji: "🛟", type: "flexible" },
      { userId: user.id, name: "Viagem ao Japão", target: 4000, saved: 1180, emoji: "🗼", type: "auto" },
      { userId: user.id, name: "Novo MacBook", target: 2200, saved: 2200, emoji: "💻", type: "fixed" },
    ],
  });

  await prisma.investmentHolding.createMany({
    data: [
      { name: "Índice Ações Globais", ticker: "GEQI", units: 42.5, value: 6180.25, costBasis: 5400.0, changePct: 14.5 },
      { name: "Fundo Obrigações Aurora", ticker: "AURB", units: 120, value: 3120.0, costBasis: 3000.0, changePct: 4.0 },
      { name: "Mercados Emergentes", ticker: "EMGX", units: 30, value: 1890.0, costBasis: 2100.0, changePct: -10.0 },
    ],
  });

  await prisma.monthlySpending.deleteMany();
  await prisma.monthlySpending.createMany({
    data: [
      { month: "Fev", income: 4200, expenses: 3120, sortIndex: 0 },
      { month: "Mar", income: 4200, expenses: 3480, sortIndex: 1 },
      { month: "Abr", income: 4600, expenses: 3010, sortIndex: 2 },
      { month: "Mai", income: 4200, expenses: 3920, sortIndex: 3 },
      { month: "Jun", income: 5150, expenses: 3340, sortIndex: 4 },
      { month: "Jul", income: 5150, expenses: 2890, sortIndex: 5 },
    ],
  });

  await prisma.categorySpending.deleteMany();
  await prisma.categorySpending.createMany({
    data: [
      { category: "Alimentação", value: 640, color: "#2FAE8B" },
      { category: "Contas", value: 420, color: "#0F6B5C" },
      { category: "Compras", value: 310, color: "#C9A227" },
      { category: "Transportes", value: 180, color: "#7C8AA5" },
      { category: "Lazer", value: 150, color: "#E4572E" },
    ],
  });

  await prisma.adminCustomerView.createMany({
    data: [
      { name: "Mariana Costa", email: "mariana.costa@example.com", status: "active", kyc: "verified", balance: 42700.62 },
      { name: "Daniel Reyes", email: "daniel.reyes@example.com", status: "active", kyc: "verified", balance: 12980.0 },
      { name: "Beatriz Santos", email: "beatriz.santos@example.com", status: "suspended", kyc: "pending", balance: 340.5 },
      { name: "Tiago Almeida", email: "tiago.almeida@example.com", status: "active", kyc: "verified", balance: 88410.25 },
      { name: "Inês Pereira", email: "ines.pereira@example.com", status: "frozen", kyc: "rejected", balance: 0 },
      { name: "Lucas Bergström", email: "lucas.b@example.com", status: "active", kyc: "verified", balance: 5620.9 },
    ],
  });

  console.log("Seed complete. Demo user:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
