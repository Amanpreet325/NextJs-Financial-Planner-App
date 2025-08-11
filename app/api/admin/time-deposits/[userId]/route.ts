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

    const timeDeposits = await prisma.timeDeposits.findUnique({
      where: { userId },
    });

    if (!timeDeposits) {
      return NextResponse.json({ error: "Time deposits not found" }, { status: 404 });
    }

    return NextResponse.json(timeDeposits);
  } catch (error) {
    console.error("Error fetching time deposits:", error);
    return NextResponse.json(
      { error: "Error fetching time deposits" },
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

    const timeDeposits = await prisma.timeDeposits.upsert({
      where: { userId },
      update: {
        deposits: data.deposits || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        deposits: data.deposits || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(timeDeposits);
  } catch (error) {
    console.error("Error saving time deposits:", error);
    return NextResponse.json(
      { error: "Error saving time deposits" },
      { status: 500 }
    );
  }
}
