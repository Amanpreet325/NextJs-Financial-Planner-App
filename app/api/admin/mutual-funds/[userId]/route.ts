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

    const mutualFunds = await prisma.mutualFunds.findUnique({
      where: { userId },
    });

    if (!mutualFunds) {
      return NextResponse.json({ error: "Mutual funds not found" }, { status: 404 });
    }
const investments = mutualFunds.investments;
let mutualFundsArray: any[] = [];

if (
  investments &&
  typeof investments === "object" &&
  !Array.isArray(investments) &&
  "mutualFunds" in investments &&
  Array.isArray((investments as any).mutualFunds)
) {
  mutualFundsArray = (investments as any).mutualFunds;
}

return NextResponse.json({ mutualFunds: mutualFundsArray });

  } catch (error) {
    console.error("Error fetching mutual funds:", error);
    return NextResponse.json(
      { error: "Error fetching mutual funds" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const data = await req.json();

    const mutualFunds = await prisma.mutualFunds.upsert({
      where: { userId },
      update: {
        investments: data.investments || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        investments: data.investments || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(mutualFunds);
  } catch (error) {
    console.error("Error saving mutual funds:", error);
    return NextResponse.json(
      { error: "Error saving mutual funds" },
      { status: 500 }
    );
  }
}
