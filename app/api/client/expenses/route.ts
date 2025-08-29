export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Fetch cash flow data for expense breakdown
    const cashFlow = await prisma.cashFlow.findUnique({
      where: { userId },
    });

    if (!cashFlow || !cashFlow.statements) {
      return NextResponse.json({ 
        expenses: [],
        totalExpenses: 0
      });
    }

    const statements = cashFlow.statements as any;
    const expenseBreakdown: { category: string; amount: number; color: string }[] = [];
    let totalExpenses = 0;

    // Define colors for different expense categories (enhanced glassy colors)
    const categoryColors: { [key: string]: string } = {
      housing: "#ef4444",        // vibrant red
      savings: "#ec4899",        // bright pink/magenta  
      education: "#3b82f6",      // vivid blue
      lifestyle: "#8b5cf6",      // rich purple/violet
      utilities: "#f97316",      // bright orange
      foodDining: "#10b981",     // emerald green
      healthcare: "#06b6d4",     // bright cyan
      transportation: "#eab308"  // golden yellow
    };

    if (statements.expenses) {
      Object.keys(statements.expenses).forEach(category => {
        if (statements.expenses[category] && typeof statements.expenses[category] === 'object') {
          let categoryTotal = 0;
          
          Object.values(statements.expenses[category]).forEach((value: any) => {
            if (value && value !== "") {
              categoryTotal += parseFloat(value) || 0;
            }
          });

          if (categoryTotal > 0) {
            // Format category name for display
            let displayName = category;
            switch (category) {
              case 'foodDining':
                displayName = 'Food & Dining';
                break;
              case 'lifestyle':
                displayName = 'Lifestyle & Entertainment';
                break;
              case 'savings':
                displayName = 'Savings & Investments';
                break;
              default:
                displayName = category.charAt(0).toUpperCase() + category.slice(1);
            }

            expenseBreakdown.push({
              category: displayName,
              amount: categoryTotal,
              color: categoryColors[category] || "#6b7280" // default gray
            });

            totalExpenses += categoryTotal;
          }
        }
      });
    }

    console.log("Expense breakdown:", expenseBreakdown);
    console.log("Total expenses:", totalExpenses);

    return NextResponse.json({
      expenses: expenseBreakdown,
      totalExpenses
    });

  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Error fetching expenses", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
