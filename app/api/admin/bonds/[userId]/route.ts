import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIdNum = parseInt(params.userId, 10);

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
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.userId, 10);
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