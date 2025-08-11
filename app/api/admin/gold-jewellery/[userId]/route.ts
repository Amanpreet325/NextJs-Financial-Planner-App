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

    const goldJewellery = await prisma.goldJewellery.findUnique({
      where: { userId },
    });

    if (!goldJewellery) {
      return NextResponse.json({ error: "Gold jewellery not found" }, { status: 404 });
    }

    return NextResponse.json(goldJewellery);
  } catch (error) {
    console.error("Error fetching gold jewellery:", error);
    return NextResponse.json(
      { error: "Error fetching gold jewellery" },
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

    const goldJewellery = await prisma.goldJewellery.upsert({
      where: { userId },
      update: {
        items: data.items || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        items: data.items || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(goldJewellery);
  } catch (error) {
    console.error("Error saving gold jewellery:", error);
    return NextResponse.json(
      { error: "Error saving gold jewellery" },
      { status: 500 }
    );
  }
}
