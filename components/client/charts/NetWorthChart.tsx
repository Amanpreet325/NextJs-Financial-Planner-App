"use client";

import { TrendingDown, TrendingUp, PiggyBank, CreditCard } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useNetWorthData, formatINRSimple } from "@/hooks/useNetWorthData";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Simulated historical data - in a real app, this would come from your API
const generateChartData = (currentAssets: number, currentLiabilities: number) => {
  const months = ["Feb", "Mar", "Apr", "May"]; // Reduced to 4 months to prevent overflow
  const data = [];
  
  for (let i = 0; i < months.length; i++) {
    // Simulate growth over time with some variation
    const assetGrowth = 1 + (i * 0.05) + (Math.random() * 0.1 - 0.05);
    const liabilityGrowth = 1 + (i * 0.03) + (Math.random() * 0.08 - 0.04);
    
    data.push({
      month: months[i],
      assets: Math.round(currentAssets * assetGrowth),
      liabilities: Math.round(currentLiabilities * liabilityGrowth),
    });
  }
  
  return data;
};

const chartConfig = {
  assets: {
    label: "Assets",
    color: "hsl(142, 76%, 36%)", // Green glass color
    icon: PiggyBank,
  },
  liabilities: {
    label: "Liabilities", 
    color: "hsl(0, 84%, 60%)", // Red glass color
    icon: CreditCard,
  },
} satisfies ChartConfig;

export function NetWorthChart() {
  const { data: netWorthData, loading, error } = useNetWorthData();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <p>Error loading net worth data: {error}</p>
      </div>
    );
  }

  const chartData = generateChartData(netWorthData.totalAssets, netWorthData.totalLiabilities);
  const netWorthGrowth = netWorthData.totalAssets > netWorthData.totalLiabilities ? "up" : "down";
  const growthPercentage = netWorthData.totalAssets > 0 
    ? (((netWorthData.totalAssets - netWorthData.totalLiabilities) / netWorthData.totalAssets) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-300 text-sm">
          Assets vs Liabilities over the last 4 months
        </p>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">₹26L</p>
        </div>
      </div>
      
      <div className="h-48">
        <ChartContainer config={chartConfig} className="h-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid 
              vertical={false} 
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="3,3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                indicator="line" 
                className="bg-slate-900/95 border-slate-700/50 backdrop-blur-sm"
                labelClassName="text-white"
                formatter={(value, name) => [formatINRSimple(Number(value)), name]}
              />}
            />
            <Area
              dataKey="liabilities"
              type="natural"
              fill="var(--color-liabilities)"
              fillOpacity={0.3}
              stroke="var(--color-liabilities)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="assets"
              type="natural"
              fill="var(--color-assets)"
              fillOpacity={0.4}
              stroke="var(--color-assets)"
              strokeWidth={2}
              stackId="a"
            />
            <ChartLegend 
              content={<ChartLegendContent className="text-slate-300" />} 
            />
          </AreaChart>
        </ChartContainer>
      </div>
      
      <div className="flex w-full items-start gap-2 text-sm mt-4">
        <div className="grid gap-1">
          <div className="flex items-center gap-2 leading-none font-medium text-white">
            Net Worth trending {netWorthGrowth} by {Math.abs(Number(growthPercentage))}%{" "}
            {netWorthGrowth === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-slate-400 flex items-center gap-2 leading-none text-xs">
            February - May 2025
          </div>
        </div>
      </div>
    </div>
  );
}