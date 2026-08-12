import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function exportDatabase() {
    console.log("Starting full database backup...");

    try {
        // Fetch records from all tables defined in your schema
        const databaseBackup = {
            exportedAt: new Date().toISOString(),
            admins: await prisma.admin.findMany(),
            users: await prisma.user.findMany(),
            verificationCodes: await prisma.verificationCode.findMany(),
            accounts: await prisma.account.findMany(),
            transactions: await prisma.transaction.findMany(),
            beneficiaries: await prisma.beneficiary.findMany(),
            cards: await prisma.card.findMany(),
            notifications: await prisma.notification.findMany(),
            loanProducts: await prisma.loanProduct.findMany(),
            loanApplications: await prisma.loanApplication.findMany(),
            savingsGoals: await prisma.savingsGoal.findMany(),
            investmentHoldings: await prisma.investmentHolding.findMany(),
            paymentAccounts: await prisma.paymentAccount.findMany(),
            loginAttempts: await prisma.loginAttempt.findMany(),
            monthlySpending: await prisma.monthlySpending.findMany(),
            categorySpending: await prisma.categorySpending.findMany(),
        };

        const timestamp = new Date().toISOString().replace('T', '_').replace(/:/g, '-').slice(0, 16);
        const fileName = `database-backup-${timestamp}.json`;
        // Outputs: database-backup-2026-08-09_11-48.json
        const filePath = path.join(process.cwd() + "/backups", fileName);

        // Save JSON data with 2-space indentation
        await fs.writeFile(filePath, JSON.stringify(databaseBackup, null, 2));

        console.log(`Backup completed successfully! Saved to: ${fileName}`);
    } catch (error) {
        console.error("Backup failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

exportDatabase();