"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const spendingData = [
  { name: 'Food & Dining', value: 850, color: '#ef4444' },
  { name: 'Transportation', value: 420, color: '#f97316' },
  { name: 'Shopping', value: 650, color: '#eab308' },
  { name: 'Entertainment', value: 280, color: '#22c55e' },
  { name: 'Bills & Utilities', value: 720, color: '#3b82f6' },
  { name: 'Healthcare', value: 180, color: '#8b5cf6' },
  { name: 'Others', value: 300, color: '#6b7280' },
];

export function SpendingChart() {
  const total = spendingData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-64 relative">
      {/* Donut Chart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spendingData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {spendingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value}`, 'Amount']}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">${total.toLocaleString()}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="grid grid-cols-2 gap-1 text-xs">
          {spendingData.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 dark:text-slate-400 truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
