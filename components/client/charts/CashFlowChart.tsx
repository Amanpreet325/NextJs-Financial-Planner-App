"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNetWorthData, formatINRSimple } from '@/hooks/useNetWorthData';

// Generate historical cash flow data based on current income/expenses
const generateCashFlowData = (monthlyIncome: number, monthlyExpenses: number) => {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  
  for (let i = 0; i < months.length; i++) {
    // Add some realistic variation to the data
    const incomeVariation = 1 + (Math.random() * 0.2 - 0.1); // ±10% variation
    const expenseVariation = 1 + (Math.random() * 0.15 - 0.075); // ±7.5% variation
    
    const monthlyInflow = Math.round(monthlyIncome * incomeVariation);
    const monthlyOutflow = Math.round(monthlyExpenses * expenseVariation);
    const netFlow = monthlyInflow - monthlyOutflow;
    
    data.push({
      month: months[i],
      inflow: monthlyInflow,
      outflow: monthlyOutflow,
      net: netFlow,
    });
  }
  
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-slate-700/50">
        <p className="text-white font-semibold mb-2">{`Month: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{formatINRSimple(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CashFlowChart() {
  const { data: netWorthData, loading, error } = useNetWorthData();
  
  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-48 flex items-center justify-center text-red-400">
        <p>Error loading cash flow data</p>
      </div>
    );
  }

  const cashFlowData = generateCashFlowData(netWorthData.monthlyIncome, netWorthData.monthlyExpenses);

  return (
    <div className="h-64 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={cashFlowData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
              if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
              return `₹${value}`;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => 
              value === 'inflow' ? 'Cash Inflow' : 
              value === 'outflow' ? 'Cash Outflow' : 'Net Cash Flow'
            }
            wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
          />
          <Bar 
            dataKey="inflow" 
            fill="rgba(34, 197, 94, 0.8)" 
            stroke="rgba(34, 197, 94, 1)"
            strokeWidth={1}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            name="inflow"
          />
          <Bar 
            dataKey="outflow" 
            fill="rgba(239, 68, 68, 0.8)" 
            stroke="rgba(239, 68, 68, 1)"
            strokeWidth={1}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationBegin={200}
            name="outflow"
          />
          <Bar 
            dataKey="net" 
            fill="rgba(59, 130, 246, 0.8)" 
            stroke="rgba(59, 130, 246, 1)"
            strokeWidth={1}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationBegin={400}
            name="net"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
