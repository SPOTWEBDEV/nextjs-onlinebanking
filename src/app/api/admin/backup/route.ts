import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

// Exports a full JSON snapshot of the platform's data. This lives in the
// app itself (not tied to Netlify or Supabase's own dashboards), so a
// super admin can pull a backup any time they can log in — even if they
// lose access to the hosting/DB provider's dashboards. Passwords are
// excluded; this is a data backup, not a credential dump.
export async function GET(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (requester.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can download backups" }, { status: 403 });
    }

    const [
      admins,
      users,
      accounts,
      transactions,
      beneficiaries,
      cards,
      notifications,
      loanProducts,
      loanApplications,
      savingsGoals,
      investmentHoldings,
      paymentAccounts,
      loginAttempts,
    ] = await Promise.all([
      prisma.admin.findMany({ select: { id: true, fullName: true, email: true, role: true, status: true, createdAt: true } }),
      prisma.user.findMany({
        select: {
          id: true, fullName: true, email: true, phone: true, avatarInitials: true, kycStatus: true,
          tier: true, status: true, securityScore: true, emailVerified: true, phoneVerified: true,
          specialNeeds: true, createdBy: true, createdAt: true,
        },
      }),
      prisma.account.findMany(),
      prisma.transaction.findMany(),
      prisma.beneficiary.findMany(),
      prisma.card.findMany({ select: { id: true, userId: true, holder: true, numberMasked: true, expiry: true, brand: true, type: true, status: true, spendLimit: true, spentThisMonth: true, currency: true, createdAt: true } }),
      prisma.notification.findMany(),
      prisma.loanProduct.findMany(),
      prisma.loanApplication.findMany(),
      prisma.savingsGoal.findMany(),
      prisma.investmentHolding.findMany(),
      prisma.paymentAccount.findMany(),
      prisma.loginAttempt.findMany(),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      exportedBy: requester.email,
      version: 1,
      data: {
        admins,
        users,
        accounts,
        transactions,
        beneficiaries,
        cards,
        notifications,
        loanProducts,
        loanApplications,
        savingsGoals,
        investmentHoldings,
        paymentAccounts,
        loginAttempts,
      },
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="banco-aurora-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    return handleApiError(err, "download backup");
  }
}
