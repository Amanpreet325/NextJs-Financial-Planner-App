export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { name, email, password, username, mobile } = await req.json();

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user with transaction to ensure all related records are created
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          username,
          mobile: mobile || "",
          role: "client",
        },
      });

      // Initialize all form records for the new user
      await Promise.all([
        tx.questionnaire.create({ 
          data: { 
            userId: newUser.id,
            personal: {},
            family: {},
            employment: {},
            income: {},
            liabilities: {},
            insurance: {},
            goals: {},
            investments: {}
          } 
        }),
        tx.financialGoals.create({ data: { userId: newUser.id, goals: {} } }),
        tx.netWorth.create({ data: { userId: newUser.id, assets: {}, liabilities: {} } }),
        tx.cashFlow.create({ data: { userId: newUser.id, statements: {} } }),
        tx.lifeInsurance.create({ data: { userId: newUser.id, policies: {} } }),
        tx.medicalInsurance.create({ data: { userId: newUser.id, policies: {} } }),
        tx.mutualFunds.create({ data: { userId: newUser.id, investments: {} } }),
        tx.equities.create({ data: { userId: newUser.id, investments: {} } }),
        tx.bonds.create({ data: { userId: newUser.id, investments: {} } }),
        tx.pPF.create({ data: { userId: newUser.id, accounts: {} } }),
        tx.realEstate.create({ data: { userId: newUser.id, properties: {} } }),
        tx.goldJewellery.create({ data: { userId: newUser.id, items: {} } }),
        tx.timeDeposits.create({ data: { userId: newUser.id, deposits: {} } }),
        tx.recurringDeposits.create({ data: { userId: newUser.id, deposits: {} } }),
        tx.demandDeposits.create({ data: { userId: newUser.id, accounts: {} } }),
      ]);

      return newUser;
    });

    // Return user without password
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all clients
    const clients = await prisma.user.findMany({
      where: { role: "client" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        questionnaire: {
          select: {
            id: true,
            isCompleted: true,
            completedAt: true,
          },
        },
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

