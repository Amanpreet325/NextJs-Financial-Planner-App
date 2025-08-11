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

    const cashFlow = await prisma.cashFlow.findUnique({
      where: { userId },
    });

    if (!cashFlow) {
      return NextResponse.json({ error: "Cash flow not found" }, { status: 404 });
    }

   const statements = cashFlow.statements ?? {};
return NextResponse.json({ statements });
  } catch (error) {
    console.error("Error fetching cash flow:", error);
    return NextResponse.json(
      { error: "Error fetching cash flow" },
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

    const cashFlow = await prisma.cashFlow.upsert({
      where: { userId },
      update: {
        statements: data.statements || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        statements: data.statements || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(cashFlow);
  } catch (error) {
    console.error("Error saving cash flow:", error);
    return NextResponse.json(
      { error: "Error saving cash flow" },
      { status: 500 }
    );
  }
}
