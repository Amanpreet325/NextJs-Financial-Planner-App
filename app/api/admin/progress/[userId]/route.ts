import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: userIdStr } = await params;
    const userId = parseInt(userIdStr);

    // Check what forms have been completed for this user
    const [
      questionnaire,
      financialGoals,
      netWorth,
      cashFlow,
  // lifeInsurance, (removed)
      medicalInsurance,
      mutualFunds,
      equities,
      bonds,
      ppf,
      realEstate,
      goldJewellery,
      timeDeposits,
      recurringDeposits,
      demandDeposits,
    ] = await Promise.all([
      prisma.questionnaire.findFirst({ where: { userId } }),
      prisma.financialGoals.findFirst({ where: { userId } }),
      prisma.netWorth.findFirst({ where: { userId } }),
      prisma.cashFlow.findFirst({ where: { userId } }),
  // prisma.lifeInsurance.findFirst({ where: { userId } }), (removed)
      prisma.medicalInsurance.findFirst({ where: { userId } }),
      prisma.mutualFunds.findFirst({ where: { userId } }),
      prisma.equities.findFirst({ where: { userId } }),
      prisma.bonds.findFirst({ where: { userId } }),
      prisma.pPF.findFirst({ where: { userId } }),
      prisma.realEstate.findFirst({ where: { userId } }),
      prisma.goldJewellery.findFirst({ where: { userId } }),
      prisma.timeDeposits.findFirst({ where: { userId } }),
      prisma.recurringDeposits.findFirst({ where: { userId } }),
      prisma.demandDeposits.findFirst({ where: { userId } }),
    ]);

    // Check if data exists (either isCompleted flag or just presence of data)
    const progress = {
      questionnaire: !!(questionnaire?.isCompleted || questionnaire),
      financialGoals: !!(financialGoals?.isCompleted || financialGoals),
      netWorth: !!(netWorth?.isCompleted || netWorth),
      cashFlow: !!(cashFlow?.isCompleted || cashFlow),
  // lifeInsurance: !!(lifeInsurance?.isCompleted || lifeInsurance), (removed)
      medicalInsurance: !!(medicalInsurance?.isCompleted || medicalInsurance),
      mutualFunds: !!(mutualFunds?.isCompleted || mutualFunds),
      equities: !!(equities?.isCompleted || equities),
      bonds: !!(bonds?.isCompleted || bonds),
      ppf: !!(ppf?.isCompleted || ppf),
      realEstate: !!(realEstate?.isCompleted || realEstate),
      goldJewellery: !!(goldJewellery?.isCompleted || goldJewellery),
      timeDeposits: !!(timeDeposits?.isCompleted || timeDeposits),
      recurringDeposits: !!(recurringDeposits?.isCompleted || recurringDeposits),
      demandDeposits: !!(demandDeposits?.isCompleted || demandDeposits),
    };

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Error fetching progress" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const { formType, completed } = await req.json();

    // TODO: Update progress tracking in your database
    // This could be a separate ProgressTracking model or flags in existing models

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Error updating progress" },
      { status: 500 }
    );
  }
}
