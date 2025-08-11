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

    const equities = await prisma.equities.findUnique({
      where: { userId },
    });

    if (!equities) {
      return NextResponse.json({ error: "Equities not found" }, { status: 404 });
    }

   const investments = equities.investments;
    let equitiesArray: any[] = [];

    if (
      investments &&
      typeof investments === "object" &&
      !Array.isArray(investments) &&
      "equities" in investments &&
      Array.isArray((investments as any).equities)
    ) {
      equitiesArray = (investments as any).equities;
    }

    return NextResponse.json({ equities: equitiesArray });
  } catch (error) {
    console.error("Error fetching equities:", error);
    return NextResponse.json(
      { error: "Error fetching equities" },
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

    const equities = await prisma.equities.upsert({
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

    return NextResponse.json(equities);
  } catch (error) {
    console.error("Error saving equities:", error);
    return NextResponse.json(
      { error: "Error saving equities" },
      { status: 500 }
    );
  }
}
