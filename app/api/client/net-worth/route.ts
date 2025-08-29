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

    // Fetch net worth data
    const netWorth = await prisma.netWorth.findUnique({
      where: { userId },
    });

    // Fetch cash flow data for monthly income calculation
    const cashFlow = await prisma.cashFlow.findUnique({
      where: { userId },
    });

    // Fetch medical insurance data
    const medicalInsurance = await prisma.medicalInsurance.findUnique({
      where: { userId },
    });

    if (!netWorth) {
      return NextResponse.json({ 
        netWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        totalInvestments: 0,
        totalInsurance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        netCashFlow: 0
      });
    }

    // Calculate monthly income from cash flow data
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    
    if (cashFlow && cashFlow.statements) {
      const statements = cashFlow.statements as any;
      console.log("Raw cash flow data:", JSON.stringify(statements, null, 2));
      
      if (statements.income) {
        // Calculate primary income
        if (statements.income.primaryIncome) {
          Object.values(statements.income.primaryIncome).forEach((value: any) => {
            if (value && value !== "") {
              monthlyIncome += parseFloat(value) || 0;
            }
          });
        }
        
        // Calculate secondary income
        if (statements.income.secondaryIncome) {
          Object.values(statements.income.secondaryIncome).forEach((value: any) => {
            if (value && value !== "") {
              monthlyIncome += parseFloat(value) || 0;
            }
          });
        }
      }
      
      // Calculate monthly expenses from all expense categories
      if (statements.expenses) {
        Object.keys(statements.expenses).forEach(category => {
          if (statements.expenses[category] && typeof statements.expenses[category] === 'object') {
            Object.values(statements.expenses[category]).forEach((value: any) => {
              if (value && value !== "") {
                monthlyExpenses += parseFloat(value) || 0;
              }
            });
          }
        });
      }
    }
    
    // Calculate net cash flow
    const netCashFlow = monthlyIncome - monthlyExpenses;

    // Calculate total insurance from medical insurance data
    let totalInsurance = 0;
    if (medicalInsurance && medicalInsurance.policies) {
      const policies = medicalInsurance.policies as any;
      console.log("Raw medical insurance data:", JSON.stringify(policies, null, 2));
      
      // Calculate from accident details
      if (policies.accidentDetails && Array.isArray(policies.accidentDetails)) {
        policies.accidentDetails.forEach((detail: any) => {
          if (detail.existingCover) {
            totalInsurance += parseFloat(detail.existingCover) || 0;
          }
        });
      }
      
      // Calculate from health details  
      if (policies.healthDetails && Array.isArray(policies.healthDetails)) {
        policies.healthDetails.forEach((detail: any) => {
          if (detail.existingHealthCover) {
            totalInsurance += parseFloat(detail.existingHealthCover) || 0;
          }
        });
      }
    }

    // Calculate totals from the JSON data
    const assets = netWorth.assets as any || {};
    const liabilities = netWorth.liabilities as any || {};

    console.log("Raw assets data:", JSON.stringify(assets, null, 2));
    console.log("Raw liabilities data:", JSON.stringify(liabilities, null, 2));

    // Calculate total assets
    let totalAssets = 0;
    let totalInvestments = 0;

    // Sum up all asset categories
    Object.keys(assets).forEach(category => {
      if (assets[category] && typeof assets[category] === 'object') {
        Object.keys(assets[category]).forEach(item => {
          // Handle the nested structure: { "Cash Balance": { "value": "12000" } }
          const itemData = assets[category][item];
          let value = 0;
          
          if (itemData && typeof itemData === 'object' && itemData.value) {
            value = parseFloat(itemData.value) || 0;
          } else if (typeof itemData === 'string') {
            value = parseFloat(itemData) || 0;
          } else if (typeof itemData === 'number') {
            value = itemData;
          }
          
          totalAssets += value;
        });
      }
    });

    // Calculate total liabilities
    let totalLiabilities = 0;
    Object.keys(liabilities).forEach(category => {
      if (liabilities[category] && typeof liabilities[category] === 'object') {
        Object.keys(liabilities[category]).forEach(item => {
          // Handle the nested structure: { "Loan Name": { "value": "5000" } }
          const itemData = liabilities[category][item];
          let value = 0;
          
          if (itemData && typeof itemData === 'object' && itemData.value) {
            value = parseFloat(itemData.value) || 0;
          } else if (typeof itemData === 'string') {
            value = parseFloat(itemData) || 0;
          } else if (typeof itemData === 'number') {
            value = itemData;
          }
          
          totalLiabilities += value;
        });
      }
    });

    // Calculate net worth
    const calculatedNetWorth = totalAssets - totalLiabilities;
    
    // Set total investments equal to total assets as requested
    totalInvestments = totalAssets;

    console.log("Calculation results:", {
      totalAssets,
      totalLiabilities,
      calculatedNetWorth,
      totalInsurance,
      totalInvestments,
      monthlyIncome,
      monthlyExpenses,
      netCashFlow
    });

    return NextResponse.json({
      netWorth: calculatedNetWorth,
      totalAssets,
      totalLiabilities,
      totalInvestments,
      totalInsurance,
      monthlyIncome,
      monthlyExpenses,
      netCashFlow
    });

  } catch (error) {
    console.error("Error fetching net worth:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    return NextResponse.json(
      { error: "Error fetching net worth", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
