import { Kpi, NetWorthPoint, CashflowPoint, SpendingCategory, GoalProgress, PortfolioAlloc, DebtItem, Alert, ActivityItem } from "@/types/client"

export function useMockKpis(): Kpi[] {
  return [
    { key: "networth", label: "Net Worth", value: 12450000, delta: 0.018, spark: [11.8, 11.9, 12.0, 12.3, 12.45], fmt: "currency" },
    { key: "savings", label: "Savings Rate", value: 0.28, delta: 0.02, spark: [0.24, 0.23, 0.26, 0.27, 0.28], fmt: "percent" },
    { key: "cashflow", label: "Cashflow", value: 145000, delta: -0.06, spark: [120, 140, 150, 155, 145], fmt: "currency" },
    { key: "returnYtd", label: "Return YTD", value: 0.102, delta: 0.008, spark: [0.03, 0.06, 0.08, 0.095, 0.102], fmt: "percent" },
    { key: "dti", label: "Debt-to-Income", value: 0.21, delta: -0.01, spark: [0.25, 0.24, 0.23, 0.22, 0.21], fmt: "percent" },
    { key: "runway", label: "Emergency Runway", value: 7.4, delta: 0.4, spark: [6.2, 6.5, 6.8, 7.0, 7.4], fmt: "number" },
  ]
}

export function useMockNetWorth(): { series: NetWorthPoint[] } {
  const base = 11000000
  const months: NetWorthPoint[] = []
  const start = new Date()
  start.setMonth(start.getMonth() - 23)
  let assets = base
  let liabilities = 2600000
  for (let i = 0; i < 24; i++) {
    assets *= 1 + (Math.random() * 0.02)
    liabilities *= 1 + (Math.random() * (Math.random() > 0.5 ? -0.01 : 0.01))
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    months.push({
      date: iso,
      assets: Math.round(assets),
      liabilities: Math.round(liabilities),
      netWorth: Math.round(assets - liabilities),
      event: Math.random() > 0.9 ? (Math.random() > 0.5 ? "Bonus" : "Tax") : undefined,
    })
  }
  return { series: months }
}

export function useMockCashflow(): CashflowPoint[] {
  const res: CashflowPoint[] = []
  const start = new Date()
  start.setMonth(start.getMonth() - 11)
  for (let i = 0; i < 12; i++) {
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const incomeFixed = 150000
    const incomeVariable = 25000 + Math.round(Math.random() * 25000)
    const expenseFixed = 80000
    const expenseVariable = 40000 + Math.round(Math.random() * 20000)
    res.push({ date: iso, incomeFixed, incomeVariable, expenseFixed, expenseVariable })
  }
  return res
}

export function useMockSpending(): SpendingCategory[] {
  return [
    { name: "Housing", amount: 62000, mom: 0.01 },
    { name: "Groceries", amount: 24000, mom: 0.08 },
    { name: "Dining", amount: 18000, mom: 0.12 },
    { name: "Transport", amount: 9500, mom: -0.05 },
    { name: "Shopping", amount: 21000, mom: 0.15 },
    { name: "Utilities", amount: 8000, mom: 0.02 },
  ]
}

export function useMockGoals(): GoalProgress[] {
  const mkSeries = (start: number) =>
    Array.from({ length: 12 }, (_, i) => ({ date: `2025-${String(i + 1).padStart(2, "0")}`, value: Math.round(start + i * (start * 0.08)) }))
  return [
    { name: "Emergency Fund", progress: 0.72, etaMonths: 4, planSeries: mkSeries(50000), actualSeries: mkSeries(52000) },
    { name: "Down Payment", progress: 0.41, etaMonths: 14, planSeries: mkSeries(80000), actualSeries: mkSeries(76000) },
    { name: "Vacation", progress: 0.9, etaMonths: 1, planSeries: mkSeries(20000), actualSeries: mkSeries(22000) },
  ]
}

export function useMockPortfolio(): PortfolioAlloc[] {
  return [
    { name: "Equities", value: 55, children: [
      { name: "US", value: 35 },
      { name: "Intl", value: 20 },
    ]},
    { name: "Bonds", value: 28, children: [
      { name: "Govt", value: 18 },
      { name: "Corp", value: 10 },
    ]},
    { name: "Cash", value: 7 },
    { name: "Alt", value: 10 },
  ]
}

export function useMockDebts(): DebtItem[] {
  return [
    { name: "Mortgage", balance: 1850000, rate: 0.072, minPayment: 22000 },
    { name: "Auto Loan", balance: 380000, rate: 0.095, minPayment: 12000 },
    { name: "Credit Card", balance: 120000, rate: 0.32, minPayment: 8000 },
  ]
}

export function useMockAlerts(): Alert[] {
  return [
    { id: "1", severity: "high", message: "Credit card utilization above 35%. Pay ₹5,000 to reach green zone." },
    { id: "2", severity: "medium", message: "Increase SIP by ₹2,000 to stay on track for down payment." },
    { id: "3", severity: "low", message: "You can save ₹2,500 in fees by consolidating accounts." },
  ]
}

export function useMockActivity(): ActivityItem[] {
  return [
    { id: "a1", date: new Date().toISOString(), description: "Salary credited", amount: 180000, type: "transaction" },
    { id: "a2", date: new Date().toISOString(), description: "Credit card bill due in 5 days", amount: 45000, type: "bill" },
  ]
}
