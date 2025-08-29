export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  _req: Request,
  props: { params: Promise<Record<string, string | string[]>> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIdParam = params.userId;
    const userIdStr = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    const userIdNum = parseInt(userIdStr ?? "", 10);
    if (Number.isNaN(userIdNum)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
    const financialGoals = await prisma.financialGoals.findUnique({
      where: { userId: userIdNum },
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

export async function POST(
  req: Request,
  props: { params: Promise<Record<string, string | string[]>> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIdParam = params.userId;
    const userIdStr = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    const userId = parseInt(userIdStr ?? "", 10);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
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
