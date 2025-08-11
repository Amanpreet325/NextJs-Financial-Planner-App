import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.userId);

    const financialGoals = await prisma.financialGoals.findUnique({
      where: { userId },
    });

    if (!financialGoals) {
      return NextResponse.json({ error: "Financial goals not found" }, { status: 404 });
    }

    return NextResponse.json(financialGoals);
  } catch (error) {
    console.error("Error fetching financial goals:", error);
    return NextResponse.json(
      { error: "Error fetching financial goals" },
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

    const userId = parseInt(params.userId);
    const data = await req.json();

    const financialGoals = await prisma.financialGoals.upsert({
      where: { userId },
      update: {
        goals: data.goals || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        goals: data.goals || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(financialGoals);
  } catch (error) {
    console.error("Error saving financial goals:", error);
    return NextResponse.json(
      { error: "Error saving financial goals" },
      { status: 500 }
    );
  }
}
