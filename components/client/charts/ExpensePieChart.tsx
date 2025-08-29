"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenseData } from '@/hooks/useExpenseData';
import { formatINRSimple } from '@/hooks/useNetWorthData';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-700/50">
        <p className="font-bold text-white text-base mb-2">{data.category}</p>
        <p className="text-slate-300 text-sm mb-1">
          Amount: <span className="font-bold text-white">{formatINRSimple(data.amount)}</span>
        </p>
        <p className="text-slate-300 text-sm">
          Share: <span className="font-bold text-white">{((data.amount / data.totalExpenses) * 100).toFixed(1)}%</span>
        </p>
        <div 
          className="w-full h-1 rounded-full mt-3" 
          style={{ backgroundColor: data.color, opacity: 0.8 }}
        />
      </div>
    );
  }
  return null;
};

export function ExpensePieChart() {
  const { data, loading, error } = useExpenseData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
          <p className="text-white/80 text-sm">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-80 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-400 opacity-50">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-300">Error loading expense data</p>
          <p className="text-red-200 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data.expenses.length) {
    return (
      <div className="flex items-center justify-center h-80 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-white/50">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-white/70">No expense data available</p>
          <p className="text-white/50 text-sm mt-1">Start tracking your expenses to see the breakdown</p>
        </div>
      </div>
    );
  }

  // Add total expenses to each data point for tooltip calculation
  const chartData = data.expenses.map(expense => ({
    ...expense,
    totalExpenses: data.totalExpenses
  }));

  return (
    <div className="w-full p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          Expense Breakdown
        </h3>
        <div className="text-right">
          <p className="text-slate-400 text-sm">Total Expenses</p>
          <p className="text-xl font-bold text-white">{formatINRSimple(data.totalExpenses)}</p>
        </div>
      </div>
      
      <div className="bg-slate-800/20 rounded-xl p-4 border border-slate-700/20">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={40}
              dataKey="amount"
              nameKey="category"
              animationBegin={0}
              animationDuration={1200}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-90 transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={80}
              iconType="circle"
              layout="horizontal"
              wrapperStyle={{
                paddingTop: '15px',
                fontSize: '12px'
              }}
              formatter={(value, entry: any) => (
                <span className="text-xs text-slate-300 ml-1 font-medium">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
