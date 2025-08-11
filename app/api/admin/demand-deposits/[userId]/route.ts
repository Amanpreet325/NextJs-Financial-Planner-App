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

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.userId);

    const demandDeposits = await prisma.demandDeposits.findUnique({
      where: { userId },
    });

    if (!demandDeposits) {
      return NextResponse.json({ error: "Demand deposits not found" }, { status: 404 });
    }

const accounts = Array.isArray(demandDeposits.accounts) ? demandDeposits.accounts : [];
return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error fetching demand deposits:", error);
    return NextResponse.json(
      { error: "Error fetching demand deposits" },
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

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.userId);
    const data = await req.json();

    const demandDeposits = await prisma.demandDeposits.upsert({
      where: { userId },
      update: {
        accounts: data.accounts || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        accounts: data.accounts || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(demandDeposits);
  } catch (error) {
    console.error("Error saving demand deposits:", error);
    return NextResponse.json(
      { error: "Error saving demand deposits" },
      { status: 500 }
    );
  }
}
