export type MonthPoint = { date: string; value: number }

export type Kpi = {
  key: string
  label: string
  value: number
  delta: number // change vs comparison period, e.g., MoM
  spark: number[]
  fmt: "currency" | "percent" | "number"
}

export type NetWorthPoint = {
  date: string // YYYY-MM
  netWorth: number
  assets: number
  liabilities: number
  event?: string
}

export type CashflowPoint = {
  date: string
  incomeFixed: number
  incomeVariable: number
  expenseFixed: number
  expenseVariable: number
}

export type SpendingCategory = {
  name: string
  amount: number
  mom: number
}

export type GoalProgress = {
  name: string
  progress: number // 0..1
  etaMonths: number
  planSeries: MonthPoint[]
  actualSeries: MonthPoint[]
}

export type PortfolioAlloc = {
  name: string
  value: number
  children?: PortfolioAlloc[]
}

export type DebtItem = {
  name: string
  balance: number
  rate: number
  minPayment: number
}

export type Alert = {
  id: string
  severity: "low" | "medium" | "high"
  message: string
}

export type ActivityItem = {
  id: string
  date: string
  description: string
  amount?: number
  type: "transaction" | "bill"
}
