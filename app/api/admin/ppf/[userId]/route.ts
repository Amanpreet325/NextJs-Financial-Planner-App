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
