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
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { userId: userIdNum },
    });

    if (!questionnaire) {
      return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });
    }

    return NextResponse.json({
      personal: questionnaire.personal ?? {},
      family: questionnaire.family ?? {},
      employment: questionnaire.employment ?? {},
      income: questionnaire.income ?? {},
      liabilities: questionnaire.liabilities ?? {},
      insurance: questionnaire.insurance ?? {},
      goals: questionnaire.goals ?? {},
      investments: questionnaire.investments ?? {},
      isCompleted: questionnaire.isCompleted,
      completedAt: questionnaire.completedAt,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching questionnaire" }, { status: 500 });
  }
}

export async function POST(  req: Request,
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

    // Create or update questionnaire
    const questionnaire = await prisma.questionnaire.upsert({
      where: {
        userId: userId,
      },
      update: {
        personal: data.personal || {},
        family: data.family || {},
        employment: data.employment || {},
        income: data.income || {},
        liabilities: data.liabilities || {},
        insurance: data.insurance || {},
        goals: data.goals || {},
        investments: data.investments || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      create: {
        userId: userId,
        personal: data.personal || {},
        family: data.family || {},
        employment: data.employment || {},
        income: data.income || {},
        liabilities: data.liabilities || {},
        insurance: data.insurance || {},
        goals: data.goals || {},
        investments: data.investments || {},
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(questionnaire);
  } catch (error) {
    console.error("Error saving questionnaire:", error);
    return NextResponse.json(
      { error: "Error saving questionnaire" },
      { status: 500 }
    );
  }
}
