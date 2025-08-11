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

    const realEstate = await prisma.realEstate.findUnique({
      where: { userId },
    });

    if (!realEstate) {
      return NextResponse.json({ error: "Real estate not found" }, { status: 404 });
    }

    const properties = Array.isArray(realEstate.properties) ? realEstate.properties : [];
    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Error fetching real estate:", error);
    return NextResponse.json(
      { error: "Error fetching real estate" },
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

    const realEstate = await prisma.realEstate.upsert({
      where: { userId },
      update: {
        properties: data.properties || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId,
        properties: data.properties || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(realEstate);
  } catch (error) {
    console.error("Error saving real estate:", error);
    return NextResponse.json(
      { error: "Error saving real estate" },
      { status: 500 }
    );
  }
}
