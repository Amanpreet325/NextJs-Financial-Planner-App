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

    const netWorth = await prisma.netWorth.findUnique({
      where: { userId },
    });

    if (!netWorth) {
      return NextResponse.json({ error: "Net worth not found" }, { status: 404 });
    }

    return NextResponse.json({
  assets: netWorth.assets ?? {},
  liabilities: netWorth.liabilities ?? {},
});
  } catch (error) {
    console.error("Error fetching net worth:", error);
    return NextResponse.json(
      { error: "Error fetching net worth" },
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

    const netWorth = await prisma.netWorth.upsert({
      where: { userId },
      update: {
        assets: data.assets || {},
        liabilities: data.liabilities || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        assets: data.assets || {},
        liabilities: data.liabilities || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(netWorth);
  } catch (error) {
    console.error("Error saving net worth:", error);
    return NextResponse.json(
      { error: "Error saving net worth" },
      { status: 500 }
    );
  }
}
