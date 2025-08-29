import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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

    const bonds = await prisma.bonds.findUnique({
      where: { userId: userIdNum },
    });

    if (!bonds) {
      return NextResponse.json({ error: "Bonds not found" }, { status: 404 });
    }

    const investments = bonds.investments;
    const bondsArray = Array.isArray(investments) ? investments : [];

    return NextResponse.json({ bonds: bondsArray });
  } catch (error) {
    console.error("Error fetching bonds:", error);
    return NextResponse.json({ error: "Error fetching bonds" }, { status: 500 });
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

    const bonds = await prisma.bonds.upsert({
      where: { userId },
      update: {
        investments: data.investments ?? {},
        isCompleted: data.isCompleted ?? false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        investments: data.investments ?? {},
        isCompleted: data.isCompleted ?? false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(bonds);
  } catch (error) {
    console.error("Error saving bonds:", error);
    return NextResponse.json({ error: "Error saving bonds" }, { status: 500 });
  }
}