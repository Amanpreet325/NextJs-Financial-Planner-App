import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: "client",
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        mobile: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}

// Create new user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, username, mobile } = await req.json();

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with transaction to ensure consistency
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          username,
          password: hashedPassword,
          mobile,
          role: "client",
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          mobile: true,
          createdAt: true,
        },
      });

      // Initialize empty form records for progress tracking
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
            investments: {},
            isCompleted: false 
          }
        }),
        tx.financialGoals.create({
          data: { 
            userId: newUser.id, 
            goals: {},
            isCompleted: false 
          }
        }),
        tx.netWorth.create({
          data: { 
            userId: newUser.id, 
            assets: {},
            liabilities: {},
            isCompleted: false 
          }
        }),
        tx.cashFlow.create({
          data: { 
            userId: newUser.id, 
            statements: {},
            isCompleted: false 
          }
        }),
        tx.lifeInsurance.create({
          data: { 
            userId: newUser.id, 
            policies: {},
            isCompleted: false 
          }
        }),
        tx.medicalInsurance.create({
          data: { 
            userId: newUser.id, 
            policies: {},
            isCompleted: false 
          }
        }),
        tx.mutualFunds.create({
          data: { 
            userId: newUser.id, 
            investments: {},
            isCompleted: false 
          }
        }),
        tx.equities.create({
          data: { 
            userId: newUser.id, 
            investments: {},
            isCompleted: false 
          }
        }),
        tx.bonds.create({
          data: { 
            userId: newUser.id, 
            investments: {},
            isCompleted: false 
          }
        }),
        tx.pPF.create({
          data: { 
            userId: newUser.id, 
            accounts: {},
            isCompleted: false 
          }
        }),
        tx.realEstate.create({
          data: { 
            userId: newUser.id, 
            properties: {},
            isCompleted: false 
          }
        }),
        tx.goldJewellery.create({
          data: { 
            userId: newUser.id, 
            items: {},
            isCompleted: false 
          }
        }),
        tx.timeDeposits.create({
          data: { 
            userId: newUser.id, 
            deposits: {},
            isCompleted: false 
          }
        }),
        tx.recurringDeposits.create({
          data: { 
            userId: newUser.id, 
            deposits: {},
            isCompleted: false 
          }
        }),
        tx.demandDeposits.create({
          data: { 
            userId: newUser.id, 
            accounts: {},
            isCompleted: false 
          }
        }),
      ]);

      return newUser;
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}
