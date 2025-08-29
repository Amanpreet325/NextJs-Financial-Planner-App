import { useState, useEffect } from 'react';

interface NetWorthData {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  totalInvestments: number;
  totalInsurance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netCashFlow: number;
}

export function useNetWorthData() {
  const [data, setData] = useState<NetWorthData>({
    netWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    totalInvestments: 0,
    totalInsurance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netCashFlow: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetWorthData = async () => {
      try {
        const response = await fetch('/api/client/net-worth');
        if (!response.ok) {
          throw new Error('Failed to fetch net worth data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNetWorthData();
  }, []);

  return { data, loading, error };
}

// Currency formatter for Indian Rupees
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Short format for large numbers in Indian system (Lakhs, Crores)
export function formatINRShort(amount: number): string {
  if (amount >= 10000000) { // 1 Crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 Lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 Thousand
    return `₹${(amount / 1000).toFixed(0)}K`;
  } else {
    return `₹${amount.toFixed(0)}`;
  }
}

// Simple format without abbreviations - just shows the full number
export function formatINRSimple(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
