import { useState, useEffect } from 'react';

interface ExpenseData {
  category: string;
  amount: number;
  color: string;
}

interface ExpenseResponse {
  expenses: ExpenseData[];
  totalExpenses: number;
}

export function useExpenseData() {
  const [data, setData] = useState<ExpenseResponse>({
    expenses: [],
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await fetch('/api/client/expenses');
        if (!response.ok) {
          throw new Error('Failed to fetch expense data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, []);

  return { data, loading, error };
}
