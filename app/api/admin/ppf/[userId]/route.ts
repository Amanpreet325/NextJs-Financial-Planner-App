export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
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

    const ppf = await prisma.pPF.findUnique({
      where: { userId },
    });

    if (!ppf) {
      return NextResponse.json({ error: "PPF not found" }, { status: 404 });
    }

    return NextResponse.json(ppf);
  } catch (error) {
    console.error("Error fetching PPF:", error);
    return NextResponse.json(
      { error: "Error fetching PPF" },
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
    const { accounts, isCompleted, completedAt } = await req.json();

    const ppf = await prisma.pPF.upsert({
      where: { userId },
      update: {
        accounts: JSON.stringify(accounts),
        isCompleted: isCompleted || false,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
      create: {
        userId,
        accounts: JSON.stringify(accounts),
        isCompleted: isCompleted || false,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    });

    return NextResponse.json(ppf);
  } catch (error) {
    console.error("Error saving PPF:", error);
    return NextResponse.json(
      { error: "Error saving PPF" },
      { status: 500 }
    );
  }
}
