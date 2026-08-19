import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = "support@spotwebtech.com.ng";
const SUPER_ADMIN_PASSWORD = "SpotAdmin2026!";

/**
 * Clean-slate seed: every table starts empty EXCEPT a single super admin
 * account. No demo customers, accounts, transactions, loan products,
 * payment accounts, or anything else — the platform starts truly empty and
 * everything else is created through the app itself (customer
 * registration, or the super admin creating admins/payment accounts/etc.
 * from the admin console).
 *
 * Re-running this script is idempotent: it wipes every table first, then
 * recreates only the super admin.
 */
async function main() {
  console.log("Seeding Banco Aurora — clean slate (super admin only)…");

  // Order matters for tables without cascading FKs to User/Account.
  await prisma.verificationCode.deleteMany();
  await prisma.loginAttempt.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.card.deleteMany();
  await prisma.beneficiary.deleteMany();
  await prisma.loanApplication.deleteMany();
  await prisma.loanProduct.deleteMany();
  await prisma.savingsGoal.deleteMany();
  await prisma.investmentHolding.deleteMany();
  await prisma.monthlySpending.deleteMany();
  await prisma.categorySpending.deleteMany();
  await prisma.paymentAccount.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();

  const superAdmin = await prisma.admin.create({
    data: {
      fullName: "Spotwebtech Support",
      email: SUPER_ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10),
      role: "super_admin",
      status: "active",
    },
  });

  console.log("Seed complete. Every table is empty except:");
  console.log("Super admin:", superAdmin.email, "/ password:", SUPER_ADMIN_PASSWORD);
  console.log("");
  console.log("Log in at /admin/login, then use the admin console to:");
  console.log("  - Register additional admins at /admin/register");
  console.log("  - Add payment accounts at /admin/payment-accounts");
  console.log("  - Create customers at /admin/customers");
  console.log("Customers can also self-register at /register.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
